'use client';
import { useState } from 'react';
import { BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Chart.js 등록
ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

// 차트 데이터 타입 정의
type ChartData = {
  name: string;
  활성사용자: number;
  신규가입: number;
  실종신고: number;
  발견신고: number;
};

export function UserActivityChart() {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  // 샘플 데이터
  const data: ChartData[] = [
    { name: '4/19', 활성사용자: 420, 신규가입: 45, 실종신고: 12, 발견신고: 8 },
    { name: '4/20', 활성사용자: 380, 신규가입: 32, 실종신고: 10, 발견신고: 5 },
    { name: '4/21', 활성사용자: 450, 신규가입: 38, 실종신고: 15, 발견신고: 9 },
    { name: '4/22', 활성사용자: 410, 신규가입: 42, 실종신고: 18, 발견신고: 11 },
    { name: '4/23', 활성사용자: 520, 신규가입: 50, 실종신고: 22, 발견신고: 14 },
    { name: '4/24', 활성사용자: 580, 신규가입: 65, 실종신고: 25, 발견신고: 16 },
    { name: '4/25', 활성사용자: 490, 신규가입: 48, 실종신고: 20, 발견신고: 12 },
  ];

  // 차트 색상 설정
  const colors = {
    활성사용자: '#8884d8',
    신규가입: '#82ca9d',
    실종신고: '#ffc658',
    발견신고: '#ff8042',
  };

  // 공통 Chart.js 데이터 구조
  const chartData = (keys: (keyof ChartData)[]) => ({
    labels: data.map((item) => item.name),
    datasets: keys.map((key) => ({
      label: key,
      data: data.map((item) => item[key]),
      backgroundColor: chartType === 'area' ? `${colors[key]}80` : colors[key], // 영역 차트는 투명도 적용
      borderColor: colors[key],
      borderWidth: 2,
      fill: chartType === 'area', // 영역 차트일 때만 fill 활성화
      pointRadius: chartType === 'line' ? 3 : 0,
      tension: chartType === 'line' ? 0.4 : 0, // 라인 차트 곡선
    })),
  });

  // Chart.js 옵션
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">최근 7일간 활동</h3>
        <div className="flex gap-2">
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
