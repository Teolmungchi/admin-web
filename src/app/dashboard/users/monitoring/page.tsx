'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// 샘플 데이터
const dailyData = [
  { name: '4/19', 신규가입: 12, 활성사용자: 120 },
  { name: '4/20', 신규가입: 19, 활성사용자: 132 },
  { name: '4/21', 신규가입: 15, 활성사용자: 99 },
  { name: '4/22', 신규가입: 27, 활성사용자: 175 },
  { name: '4/23', 신규가입: 24, 활성사용자: 163 },
  { name: '4/24', 신규가입: 32, 활성사용자: 188 },
  { name: '4/25', 신규가입: 18, 활성사용자: 145 },
];

const monthlyData = [
  { name: '1월', 신규가입: 120, 활성사용자: 1250 },
  { name: '2월', 신규가입: 145, 활성사용자: 1380 },
  { name: '3월', 신규가입: 162, 활성사용자: 1420 },
  { name: '4월', 신규가입: 178, 활성사용자: 1550 },
];

const deviceData = [
  { name: '모바일', 사용자: 68 },
  { name: '데스크톱', 사용자: 24 },
  { name: '태블릿', 사용자: 8 },
];

export default function UserMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">사용자 모니터링</h1>
        <p className="text-muted-foreground">사용자 활동 및 통계를 모니터링합니다.</p>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">일별 통계</TabsTrigger>
          <TabsTrigger value="monthly">월별 통계</TabsTrigger>
          <TabsTrigger value="devices">기기별 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>일별 사용자 통계</CardTitle>
              <CardDescription>최근 7일간의 사용자 활동 데이터</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="신규가입" fill="#8884d8" />
                    <Bar dataKey="활성사용자" fill="#82ca9d" />
                    fill="#8884d8" />
                    <Bar dataKey="활성사용자" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>월별 사용자 통계</CardTitle>
              <CardDescription>최근 4개월간의 사용자 활동 데이터</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="신규가입" stroke="#8884d8" />
                    <Line type="monotone" dataKey="활성사용자" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기기별 사용자 통계</CardTitle>
              <CardDescription>사용자가 접속하는 기기 유형 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="사용자" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
