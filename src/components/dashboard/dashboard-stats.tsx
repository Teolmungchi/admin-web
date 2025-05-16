'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Flag, PawPrint, Users } from 'lucide-react';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    missingReports: 0,
    foundReports: 0,
    matchingSuccessRate: 0,
    usersChange: 0,
    missingToday: 0,
    foundToday: 0,
    matchingChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('https://tmc.kro.kr/api/v1/admin/dashboard', {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setStats({
          totalUsers: data.totalUsers || 0,
          missingReports: data.missingReports || 0,
          foundReports: data.foundReports || 0,
          matchingSuccessRate: data.matchingSuccessRate || 0,
          usersChange: data.usersChange || 0,
          missingToday: data.missingToday || 0,
          foundToday: data.foundToday || 0,
          matchingChange: data.matchingChange || 0,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            전월 대비 {stats.usersChange >= 0 ? '+' : ''}
            {stats.usersChange}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">실종 신고</CardTitle>
          <PawPrint className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.missingReports.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">오늘 +{stats.missingToday}건</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">발견 신고</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.foundReports.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">오늘 +{stats.foundToday}건</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">발견률</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.matchingSuccessRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            전월 대비 {stats.matchingChange >= 0 ? '+' : ''}
            {stats.matchingChange}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
