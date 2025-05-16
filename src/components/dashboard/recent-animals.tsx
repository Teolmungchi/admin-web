"use client";

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

type Animal = {
  id: string;
  type: 'missing' | 'found'; // 이 필드는 이제 아래에서 재정의
  animalType: string;
  breed: string;
  location: string;
  date: string;
  image?: string;
  user: {
    name: string;
    avatar?: string;
  };
  matchingStatuses?: string[];
};

export function RecentAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await fetch('https://tmc.kro.kr/api/v1/admin/recent', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // 데이터 변환
        const mapped = data.map((item: any) => {
          // matchingStatuses가 없거나, 배열에 FOUND가 하나라도 있으면 found, 아니면 missing
          const isFound =
            Array.isArray(item.matchingStatuses) &&
            item.matchingStatuses.includes('FOUND');
          return {
            id: item.id.toString(),
            // type은 matchingStatuses에 따라 재정의
            type: isFound ? 'found' : 'missing',
            animalType: item.animalType,
            breed: item.breed,
            location: item.location,
            date: item.date,
            image: item.image || '/placeholder.svg?height=40&width=40',
            user: {
              name: item.user.name,
              avatar: item.user.avatar || '/placeholder.svg?height=40&width=40',
            },
            matchingStatuses: item.matchingStatuses || [],
          };
        });
        setAnimals(mapped);
      } catch (e) {
        setError('데이터를 불러오는 데 실패했습니다.');
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
                <div>
                  <p className="font-medium">{animal.animalType}</p>
                </div>
              </div>
            </td>
            <td className="py-3 px-4">{animal.animalType}</td>
            <td className="py-3 px-4">{animal.location}</td>
            <td className="py-3 px-4">{animal.date}</td>
            <td className="py-3 px-4">{animal.user.name}</td>
            <td className="py-3 px-4">
              <Badge variant={animal.type === 'missing' ? 'destructive' : 'default'}>
                {animal.type === 'missing' ? '실종' : '발견'}
              </Badge>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
