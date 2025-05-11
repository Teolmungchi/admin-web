import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Animal = {
  id: string;
  type: 'missing' | 'found';
  animalType: string;
  breed: string;
  location: string;
  date: string;
  image?: string;
  user: {
    name: string;
    avatar?: string;
  };
};

export function RecentAnimals() {
  // 샘플 데이터
  const animals: Animal[] = [
    {
      id: '1',
      type: 'missing',
      animalType: '고양이',
      breed: '코리안 숏헤어',
      location: '서울시 강남구',
      date: '2023-04-24',
      image: '/placeholder.svg?height=40&width=40',
      user: {
        name: '김철수',
      },
    },
    {
      id: '2',
      type: 'found',
      animalType: '강아지',
      breed: '말티즈',
      location: '서울시 마포구',
      date: '2023-04-24',
      image: '/placeholder.svg?height=40&width=40',
      user: {
        name: '이영희',
      },
    },
    {
      id: '3',
      type: 'missing',
      animalType: '고양이',
      breed: '페르시안',
      location: '서울시 송파구',
      date: '2023-04-23',
      image: '/placeholder.svg?height=40&width=40',
      user: {
        name: '박지민',
      },
    },
    {
      id: '4',
      type: 'found',
      animalType: '고양이',
      breed: '러시안 블루',
      location: '서울시 용산구',
      date: '2023-04-23',
      image: '/placeholder.svg?height=40&width=40',
      user: {
        name: '최유진',
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">동물 정보</th>
            <th className="text-left py-3 px-4 font-medium">종류</th>
            <th className="text-left py-3 px-4 font-medium">위치</th>
            <th className="text-left py-3 px-4 font-medium">등록일</th>
            <th className="text-left py-3 px-4 font-medium">등록자</th>
            <th className="text-left py-3 px-4 font-medium">상태</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={animal.image || '/placeholder.svg'} alt={animal.animalType} />
                    <AvatarFallback>{animal.animalType.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{animal.animalType}</p>
                    <p className="text-sm text-muted-foreground">{animal.breed}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">{animal.animalType}</td>
              <td className="py-3 px-4">{animal.location}</td>
              <td className="py-3 px-4">{animal.date}</td>
              <td className="py-3 px-4">{animal.user.name}</td>
              <td className="py-3 px-4">
                <Badge variant={animal.type === 'missing' ? 'destructive' : 'default'}>{animal.type === 'missing' ? '실종' : '보호'}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
