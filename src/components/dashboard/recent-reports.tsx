import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Report = {
  id: string;
  type: 'missing' | 'found';
  animalType: string;
  location: string;
  date: string;
  user: {
    name: string;
    avatar?: string;
  };
};

export function RecentReports() {
  // 샘플 데이터
  const reports: Report[] = [
    {
      id: '1',
      type: 'missing',
      animalType: '고양이',
      location: '서울시 강남구',
      date: '2023-04-24',
      user: {
        name: '김철수',
      },
    },
    {
      id: '2',
      type: 'found',
      animalType: '강아지',
      location: '서울시 마포구',
      date: '2023-04-24',
      user: {
        name: '이영희',
      },
    },
    {
      id: '3',
      type: 'missing',
      animalType: '고양이',
      location: '서울시 송파구',
      date: '2023-04-23',
      user: {
        name: '박지민',
      },
    },
    {
      id: '4',
      type: 'found',
      animalType: '고양이',
      location: '서울시 용산구',
      date: '2023-04-23',
      user: {
        name: '최유진',
      },
    },
  ];

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="flex items-center justify-between space-x-4 rounded-md border p-3">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={report.user.avatar || '/placeholder.svg'} />
              <AvatarFallback>{report.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {report.animalType} - {report.location}
              </p>
              <p className="text-xs text-muted-foreground">
                {report.user.name} • {report.date}
              </p>
            </div>
          </div>
          <Badge variant={report.type === 'missing' ? 'destructive' : 'default'}>{report.type === 'missing' ? '실종' : '발견'}</Badge>
        </div>
      ))}
    </div>
  );
}
