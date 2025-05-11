import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { UserActivityChart } from '@/components/dashboard/user-activity-chart';
import { RecentAnimals } from '@/components/dashboard/recent-animals';
import { MatchingStats } from '@/components/dashboard/matching-stats';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>사용자 활동</CardTitle>
            <CardDescription>최근 7일간 사용자 활동 통계</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivityChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI 매칭 통계</CardTitle>
            <CardDescription>AI 매칭 성공률 및 통계</CardDescription>
          </CardHeader>
          <CardContent>
            <MatchingStats />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 등록된 동물</CardTitle>
          <CardDescription>최근 등록된 실종/보호 동물 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentAnimals />
        </CardContent>
      </Card>
    </div>
  );
}
