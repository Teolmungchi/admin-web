'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Eye, Filter, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress'; // 샘플 매칭 이력 데이터

// 샘플 매칭 이력 데이터
const matchingHistory = [
  {
    id: '1',
    date: '2023-04-25',
    time: '14:32:45',
    missingAnimal: {
      id: 'm1',
      name: '초코',
      type: '고양이',
      breed: '코리안 숏헤어',
      image: '/placeholder.svg?height=40&width=40',
      owner: '김철수',
    },
    foundAnimal: {
      id: 'f1',
      type: '고양이',
      breed: '코리안 숏헤어',
      image: '/placeholder.svg?height=40&width=40',
      finder: '박지민',
    },
    similarity: 92,
    status: 'matched',
    matchType: 'auto',
  },
  {
    id: '2',
    date: '2023-04-24',
    time: '10:15:22',
    missingAnimal: {
      id: 'm2',
      name: '몽이',
      type: '강아지',
      breed: '말티즈',
      image: '/placeholder.svg?height=40&width=40',
      owner: '이영희',
    },
    foundAnimal: {
      id: 'f2',
      type: '강아지',
      breed: '말티즈',
      image: '/placeholder.svg?height=40&width=40',
      finder: '최유진',
    },
    similarity: 88,
    status: 'matched',
    matchType: 'auto',
  },
  {
    id: '3',
    date: '2023-04-23',
    time: '16:45:10',
    missingAnimal: {
      id: 'm3',
      name: '나비',
      type: '고양이',
      breed: '페르시안',
      image: '/placeholder.svg?height=40&width=40',
      owner: '박지민',
    },
    foundAnimal: {
      id: 'f3',
      type: '고양이',
      breed: '페르시안 믹스',
      image: '/placeholder.svg?height=40&width=40',
      finder: '정민수',
    },
    similarity: 78,
    status: 'rejected',
    matchType: 'auto',
  },
  {
    id: '4',
    date: '2023-04-22',
    time: '09:20:33',
    missingAnimal: {
      id: 'm4',
      name: '루시',
      type: '고양이',
      breed: '러시안 블루',
      image: '/placeholder.svg?height=40&width=40',
      owner: '최유진',
    },
    foundAnimal: {
      id: 'f4',
      type: '고양이',
      breed: '러시안 블루',
      image: '/placeholder.svg?height=40&width=40',
      finder: '김철수',
    },
    similarity: 95,
    status: 'matched',
    matchType: 'manual',
  },
  {
    id: '5',
    date: '2023-04-21',
    time: '13:10:05',
    missingAnimal: {
      id: 'm5',
      name: '해피',
      type: '강아지',
      breed: '골든 리트리버',
      image: '/placeholder.svg?height=40&width=40',
      owner: '정민수',
    },
    foundAnimal: {
      id: 'f5',
      type: '강아지',
      breed: '래브라도 리트리버',
      image: '/placeholder.svg?height=40&width=40',
      finder: '이영희',
    },
    similarity: 65,
    status: 'pending',
    matchType: 'auto',
  },
];

// 매칭 상세 정보 타입
type MatchingDetail = {
  id: string;
  missingAnimal: {
    image: string;
    name: string;
    type: string;
    breed: string;
    color?: string;
    gender?: string;
    age?: string;
    features?: string[];
    owner: string;
    contact?: string;
    reportDate?: string;
    location?: string;
  };
  foundAnimal: {
    image: string;
    type: string;
    breed: string;
    color?: string;
    gender?: string;
    age?: string;
    features?: string[];
    finder: string;
    contact?: string;
    foundDate?: string;
    location?: string;
  };
  similarity: number;
  matchingPoints?: {
    feature: string;
    score: number;
  }[];
  status: string;
  matchType: string;
  date: string;
  time: string;
};

// 샘플 매칭 상세 정보
const matchingDetails: Record<string, MatchingDetail> = {
  '1': {
    id: '1',
    missingAnimal: {
      image: '/placeholder.svg?height=200&width=200',
      name: '초코',
      type: '고양이',
      breed: '코리안 숏헤어',
      color: '검정/흰색',
      gender: '수컷',
      age: '3세',
      features: ['목에 빨간 목줄', '왼쪽 귀에 작은 흠집', '흰색 발'],
      owner: '김철수',
      contact: '010-1234-5678',
      reportDate: '2023-04-20',
      location: '서울시 강남구',
    },
    foundAnimal: {
      image: '/placeholder.svg?height=200&width=200',
      type: '고양이',
      breed: '코리안 숏헤어',
      color: '검정/흰색',
      gender: '수컷',
      age: '3-4세 추정',
      features: ['목줄 없음', '왼쪽 귀에 흠집', '흰색 발'],
      finder: '박지민',
      contact: '010-3456-7890',
      foundDate: '2023-04-24',
      location: '서울시 강남구 인근',
    },
    similarity: 92,
    matchingPoints: [
      { feature: '품종', score: 100 },
      { feature: '색상', score: 95 },
      { feature: '체형', score: 90 },
      { feature: '특징', score: 85 },
      { feature: '위치', score: 90 },
    ],
    status: 'matched',
    matchType: 'auto',
    date: '2023-04-25',
    time: '14:32:45',
  },
  // 다른 상세 정보들...
};

export default function MatchingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // 검색 및 필터링된 매칭 이력
  const filteredHistory = matchingHistory.filter((match) => {
    const matchesSearch =
      match.missingAnimal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.missingAnimal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.foundAnimal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.missingAnimal.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.foundAnimal.finder.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = (!startDate || match.date >= startDate) && (!endDate || match.date <= endDate);

    return matchesSearch && matchesDateRange;
  });

  const handleViewDetail = (id: string) => {
    setSelectedMatch(id);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 유사도 매칭 결과 이력</h1>
          <p className="text-muted-foreground">AI 매칭 결과 이력을 조회하고 관리합니다.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          내보내기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>매칭 이력</CardTitle>
          <CardDescription>AI 유사도 매칭 결과 이력을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름, 품종, 등록자로 검색..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-[140px]" />
              <span>~</span>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[140px]" />
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜/시간</TableHead>
                <TableHead>실종 동물</TableHead>
                <TableHead>발견 동물</TableHead>
                <TableHead>유사도</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>매칭 유형</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{match.date}</span>
                      <span className="text-sm text-muted-foreground">{match.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={match.missingAnimal.image || '/placeholder.svg'} alt={match.missingAnimal.name} />
                        <AvatarFallback>{match.missingAnimal.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{match.missingAnimal.name}</p>
                        <p className="text-xs text-muted-foreground">{match.missingAnimal.breed}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={match.foundAnimal.image || '/placeholder.svg'} alt={match.foundAnimal.type} />
                        <AvatarFallback>{match.foundAnimal.type.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{match.foundAnimal.type}</p>
                        <p className="text-xs text-muted-foreground">{match.foundAnimal.breed}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={match.similarity} className="w-[60px]" />
                      <span>{match.similarity}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={match.status === 'matched' ? 'success' : match.status === 'rejected' ? 'destructive' : 'outline'}>
                      {match.status === 'matched' ? '매칭됨' : match.status === 'rejected' ? '거부됨' : '대기중'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{match.matchType === 'auto' ? '자동' : '수동'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(match.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      상세
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 매칭 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>매칭 상세 정보</DialogTitle>
            <DialogDescription>AI 유사도 매칭 결과의 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedMatch && matchingDetails[selectedMatch] && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">매칭 ID: {matchingDetails[selectedMatch].id}</p>
                  <p className="text-sm text-muted-foreground">
                    {matchingDetails[selectedMatch].date} {matchingDetails[selectedMatch].time}
                  </p>
                </div>
                <Badge
                  variant={
                    matchingDetails[selectedMatch].status === 'matched'
                      ? 'success'
                      : matchingDetails[selectedMatch].status === 'rejected'
                        ? 'destructive'
                        : 'outline'
                  }
                >
                  {matchingDetails[selectedMatch].status === 'matched'
                    ? '매칭됨'
                    : matchingDetails[selectedMatch].status === 'rejected'
                      ? '거부됨'
                      : '대기중'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">실종 동물</h3>
                  <div className="flex justify-center">
                    <Avatar className="h-40 w-40">
                      <AvatarImage
                        src={matchingDetails[selectedMatch].missingAnimal.image || '/placeholder.svg'}
                        alt={matchingDetails[selectedMatch].missingAnimal.name}
                      />
                      <AvatarFallback>{matchingDetails[selectedMatch].missingAnimal.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">이름</p>
                        <p className="font-medium">{matchingDetails[selectedMatch].missingAnimal.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">종류</p>
                        <p>{matchingDetails[selectedMatch].missingAnimal.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">품종</p>
                        <p>{matchingDetails[selectedMatch].missingAnimal.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">색상</p>
                        <p>{matchingDetails[selectedMatch].missingAnimal.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">성별</p>
                        <p>{matchingDetails[selectedMatch].missingAnimal.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">나이</p>
                        <p>{matchingDetails[selectedMatch].missingAnimal.age}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">특징</p>
                      <ul className="list-disc pl-5">
                        {matchingDetails[selectedMatch].missingAnimal.features?.map((feature, index) => <li key={index}>{feature}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">실종 위치</p>
                      <p>{matchingDetails[selectedMatch].missingAnimal.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">실종 신고일</p>
                      <p>{matchingDetails[selectedMatch].missingAnimal.reportDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">신고자</p>
                      <p>{matchingDetails[selectedMatch].missingAnimal.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">연락처</p>
                      <p>{matchingDetails[selectedMatch].missingAnimal.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">발견 동물</h3>
                  <div className="flex justify-center">
                    <Avatar className="h-40 w-40">
                      <AvatarImage
                        src={matchingDetails[selectedMatch].foundAnimal.image || '/placeholder.svg'}
                        alt={matchingDetails[selectedMatch].foundAnimal.type}
                      />
                      <AvatarFallback>{matchingDetails[selectedMatch].foundAnimal.type.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">종류</p>
                        <p>{matchingDetails[selectedMatch].foundAnimal.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">품종</p>
                        <p>{matchingDetails[selectedMatch].foundAnimal.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">색상</p>
                        <p>{matchingDetails[selectedMatch].foundAnimal.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">성별</p>
                        <p>{matchingDetails[selectedMatch].foundAnimal.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">나이</p>
                        <p>{matchingDetails[selectedMatch].foundAnimal.age}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">특징</p>
                      <ul className="list-disc pl-5">
                        {matchingDetails[selectedMatch].foundAnimal.features?.map((feature, index) => <li key={index}>{feature}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">발견 위치</p>
                      <p>{matchingDetails[selectedMatch].foundAnimal.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">발견일</p>
                      <p>{matchingDetails[selectedMatch].foundAnimal.foundDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">발견자</p>
                      <p>{matchingDetails[selectedMatch].foundAnimal.finder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">연락처</p>
                      <p>{matchingDetails[selectedMatch].foundAnimal.contact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">유사도 분석</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">{matchingDetails[selectedMatch].similarity}%</div>
                  <Progress value={matchingDetails[selectedMatch].similarity} className="flex-1" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">매칭 포인트 분석</p>
                  <div className="grid grid-cols-2 gap-4">
                    {matchingDetails[selectedMatch].matchingPoints?.map((point, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{point.feature}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={point.score} className="w-[100px]" />
                          <span className="text-sm">{point.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
