'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Download, Eye, Filter, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// 매칭 이력 타입
type MatchingHistoryItem = {
  id: string;
  date: string;
  time: string;
  missingAnimal: {
    id: string;
    name: string;
    type: string;
    breed: string;
    owner: string;
  };
  foundAnimal: {
    id: string;
    type: string;
    breed: string;
    finder: string;
  };
  similarity: number;
  status: string;
  matchType: string;
};

// 매칭 상세 정보 타입
type MatchingDetail = {
  id: string;
  missingAnimal: {
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

export default function MatchingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [matchingHistory, setMatchingHistory] = useState<MatchingHistoryItem[]>([]);
  const [matchingDetails, setMatchingDetails] = useState<Record<string, MatchingDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 데이터 가져오기
  const fetchMatchingHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://tmc.kro.kr/api/v1/admin/all', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`매칭 이력을 불러오지 못했습니다: ${res.status}`);

      const { httpStatus, success, data } = await res.json();

      if (httpStatus !== 200 || !success) {
        throw new Error('API 응답이 실패했습니다');
      }

      // feeds와 matchingResults를 매칭 이력으로 변환
      const history: MatchingHistoryItem[] = [];
      const details: Record<string, MatchingDetail> = {};

      data.feeds.forEach((feed: any) => {
        if (feed.matchingResults && feed.matchingResults.length > 0) {
          feed.matchingResults.forEach((result: any) => {
            const createdAt = new Date(result.createdAt);
            const date = createdAt.toISOString().split('T')[0];
            const time = createdAt.toTimeString().split(' ')[0];
            const matchId = `${feed.id}-${result.id}`;

            const historyItem: MatchingHistoryItem = {
              id: matchId,
              date,
              time,
              missingAnimal: {
                id: feed.id.toString(),
                name: feed.title,
                type: ['샴', '페르시안', '코리안 숏헤어', '러시안 블루'].includes(feed.dogType)
                  ? '고양이'
                  : '강아지',
                breed: feed.dogType,
                owner: feed.author.name,
              },
              foundAnimal: {
                id: result.id.toString(),
                type: ['샴', '페르시안', '코리안 숏헤어', '러시안 블루'].includes(feed.dogType)
                  ? '고양이'
                  : '강아지',
                breed: feed.dogType, // 발견 동물의 품종은 가정
                finder: '알 수 없음', // API에 발견자 정보 없음
              },
              similarity: result.similarity,
              status: result.status === 'FOUND' ? 'matched' : 'rejected',
              matchType: 'auto', // API에 매칭 유형 정보 없음, 기본값
            };

            const detailItem: MatchingDetail = {
              id: matchId,
              missingAnimal: {
                name: feed.title,
                type: ['샴', '페르시안', '코리안 숏헤어', '러시안 블루'].includes(feed.dogType)
                  ? '고양이'
                  : '강아지',
                breed: feed.dogType,
                color: feed.dogColor,
                gender: feed.dogGender === '남' || feed.dogGender === '남자' ? '수컷' : feed.dogGender === '여' || feed.dogGender === '여자' ? '암컷' : '미상',
                age: feed.dogAge ? `${feed.dogAge}세` : '알 수 없음',
                features: feed.dogFeature ? [feed.dogFeature] : [],
                owner: feed.author.name,
                contact: feed.author.serialId, // 이메일을 연락처로 사용
                reportDate: feed.lostDate,
                location: feed.lostPlace,
              },
              foundAnimal: {
                type: ['샴', '페르시안', '코리안 숏헤어', '러시안 블루'].includes(feed.dogType)
                  ? '고양이'
                  : '강아지',
                breed: feed.dogType, // 발견 동물의 품종은 가정
                color: feed.dogColor, // 동일 색상 가정
                gender: feed.dogGender === '남' || feed.dogGender === '남자' ? '수컷' : feed.dogGender === '여' || feed.dogGender === '여자' ? '암컷' : '미상',
                age: feed.dogAge ? `${feed.dogAge}세` : '알 수 없음', // 동일 나이 가정
                features: feed.dogFeature ? [feed.dogFeature] : [],
                finder: '알 수 없음', // 발견자 정보 없음
                contact: '알 수 없음',
                foundDate: date, // 매칭 결과 생성일을 발견일로 사용
                location: feed.lostPlace, // 동일 위치 가정
              },
              similarity: result.similarity,
              matchingPoints: [
                { feature: '품종', score: Math.min(result.similarity + 10, 100) },
                { feature: '색상', score: result.similarity },
                { feature: '체형', score: Math.max(result.similarity - 10, 0) },
                { feature: '특징', score: result.similarity },
                { feature: '위치', score: Math.min(result.similarity + 5, 100) },
              ],
              status: result.status === 'FOUND' ? 'matched' : 'rejected',
              matchType: 'auto',
              date,
              time,
            };

            history.push(historyItem);
            details[matchId] = detailItem;
          });
        }
      });

      setMatchingHistory(history);
      setMatchingDetails(details);
    } catch (e) {
      setError('매칭 이력을 불러오는 데 실패했습니다: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchMatchingHistory();
  }, []);

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                    <div>
                      <p className="font-medium">{match.missingAnimal.name}</p>
                      <p className="text-xs text-muted-foreground">{match.missingAnimal.breed}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{match.foundAnimal.type}</p>
                      <p className="text-xs text-muted-foreground">{match.foundAnimal.breed}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={match.similarity} className="w-[60px]" />
                      <span>{match.similarity}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        match.status === 'rejected'
                          ? 'destructive'
                          : match.status === 'matched'
                            ? 'default'
                            : 'outline'
                      }
                      className={match.status === 'matched' ? "bg-green-500 text-white" : ""}
                    >
                      {match.status === 'matched'
                        ? '매칭됨'
                        : match.status === 'rejected'
                          ? '거부됨'
                          : '대기중'}
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
                    matchingDetails[selectedMatch].status === 'rejected'
                      ? 'destructive'
                      : matchingDetails[selectedMatch].status === 'matched'
                        ? 'default'
                        : 'outline'
                  }
                  className={
                    matchingDetails[selectedMatch].status === 'matched'
                      ? "bg-green-500 text-white"
                      : ""
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
                        {matchingDetails[selectedMatch].missingAnimal.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
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
                        {matchingDetails[selectedMatch].foundAnimal.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
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