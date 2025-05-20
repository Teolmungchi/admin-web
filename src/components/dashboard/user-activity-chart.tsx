'use client';

import { useEffect, useState } from 'react';
import { BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const colors = {
  활성사용자: '#8884d8',
  신규가입: '#82ca9d',
  실종신고: '#ffc658',
  발견신고: '#ff8042',
} as const;

type ChartKey = keyof typeof colors;
type ChartData = {
  name: string;
} & Record<ChartKey, number>;



type DashboardData = {
  totalUsers: number;
  missingReports: number;
  foundReports: number;
  matchingSuccessRate: number;
  usersChange: number;
  missingToday: number;
  foundToday: number;
  matchingChange: number;
};

export function UserActivityChart() {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const fillMissingDates = (activityData: any[], dashboardData: DashboardData | null, startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allDates: ChartData[] = [];
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const foundReportsPerDay = dashboardData?.foundReports ? Math.round(dashboardData.foundReports / totalDays) : 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const found = activityData.find((item) => item.date.startsWith(dateStr));
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      allDates.push({
        name: d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
        활성사용자: found ? found.activeUsers : 0,
        신규가입: found ? found.newUsers : 0,
        실종신고: found ? found.missingReports : 0,
        발견신고:
          found && found.foundReports ? found.foundReports : isToday && dashboardData?.foundToday ? dashboardData.foundToday : foundReportsPerDay,
      });
    }
    return allDates;
  };

  useEffect(() => {
    async function fetchActivityData() {
      if (!dateRange?.from || !dateRange?.to) return;

      setLoading(true);
      setError(null);
      try {
        const startDateStr = dateRange.from.toISOString().split('T')[0];
        const endDateStr = dateRange.to.toISOString().split('T')[0];

        const [activityRes, dashboardRes] = await Promise.all([
          fetch(`https://tmc.kro.kr/api/v1/admin/activity?startDate=${startDateStr}&endDate=${endDateStr}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('https://tmc.kro.kr/api/v1/admin/dashboard', {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!activityRes.ok || !dashboardRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const activityData = await activityRes.json();
        const dashboardData = await dashboardRes.json();

        const mappedData = fillMissingDates(activityData, dashboardData, dateRange.from, dateRange.to);
        setData(mappedData);
      } catch (e) {
        setError('데이터를 불러오는 데 실패했습니다.');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, [dateRange]);


  const chartData = (keys: ChartKey[]) => ({
    labels: data.map((item) => item.name),
    datasets: keys.map((key) => ({
      label: key,
      data: data.map((item) => item[key]),
      backgroundColor: chartType === 'area' ? `${colors[key]}80` : colors[key],
      borderColor: colors[key],
      borderWidth: 2,
      fill: chartType === 'area',
      pointRadius: chartType === 'line' ? 3 : 0,
      tension: chartType === 'line' ? 0.4 : 0,
    })),
  });;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#f0f0f0',
          lineWidth: 1,
          borderDash: [3, 3],
        },
        ticks: {
          font: { size: 12 },
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
          lineWidth: 1,
          borderDash: [3, 3],
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[250px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center h-[250px] flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} placeholder={'조회 기간'} className="w-full" />
          </div>
          <button
            onClick={() => setChartType('line')}
            className={`px-2 py-1 text-xs rounded ${
              chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            선 그래프
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-2 py-1 text-xs rounded ${
              chartType === 'area' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            영역 그래프
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-2 py-1 text-xs rounded ${
              chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            막대 그래프
          </button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full space-y-2">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="missing">실종신고</TabsTrigger>
          <TabsTrigger value="found">발견신고</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="h-[250px]">
          {chartType === 'bar' ? (
            <Bar data={chartData(['활성사용자', '신규가입', '실종신고', '발견신고'])} options={chartOptions} />
          ) : (
            <Line data={chartData(['활성사용자', '신규가입', '실종신고', '발견신고'])} options={chartOptions} />
          )}
        </TabsContent>

        <TabsContent value="users" className="h-[250px]">
          {chartType === 'bar' ? (
            <Bar data={chartData(['활성사용자', '신규가입'])} options={chartOptions} />
          ) : (
            <Line data={chartData(['활성사용자', '신규가입'])} options={chartOptions} />
          )}
        </TabsContent>

        <TabsContent value="missing" className="h-[250px]">
          {chartType === 'bar' ? (
            <Bar data={chartData(['실종신고'])} options={chartOptions} />
          ) : (
            <Line data={chartData(['실종신고'])} options={chartOptions} />
          )}
        </TabsContent>

        <TabsContent value="found" className="h-[250px]">
          {chartType === 'bar' ? (
            <Bar data={chartData(['발견신고'])} options={chartOptions} />
          ) : (
            <Line data={chartData(['발견신고'])} options={chartOptions} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
