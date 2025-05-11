import { Button } from '@/components/ui/button';
import { Bell, Calendar } from 'lucide-react';

export function DashboardHeader() {
  // 현재 날짜 포맷팅
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          <Calendar className="inline mr-1 h-4 w-4" />
          {formattedDate}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/*<Button variant="outline" size="icon">*/}
        {/*  <Bell className="h-4 w-4" />*/}
        {/*</Button>*/}
        {/*<Button>새로고침</Button>*/}
      </div>
    </div>
  );
}
