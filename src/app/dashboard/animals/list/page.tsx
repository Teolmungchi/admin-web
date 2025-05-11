'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Edit, Eye, Filter, MapPin, MoreHorizontal, PlusCircle, Search, Trash2, User } from 'lucide-react';

// 샘플 동물 데이터
const animals = [
  {
    id: '1',
    name: '초코',
    type: 'missing',
    animalType: '고양이',
    breed: '코리안 숏헤어',
    gender: '수컷',
    age: '3세',
    color: '검정/흰색',
    location: '서울시 강남구',
    date: '2023-04-24',
    description: '목에 빨간 목줄을 하고 있으며, 왼쪽 귀에 작은 흠집이 있습니다.',
    image: '/placeholder.svg?height=200&width=200',
    user: {
      name: '김철수',
      email: 'kim@example.com',
      phone: '010-1234-5678',
    },
    status: 'active',
  },
  {
    id: '2',
    name: '몽이',
    type: 'found',
    animalType: '강아지',
    breed: '말티즈',
    gender: '암컷',
    age: '2세 추정',
    color: '흰색',
    location: '서울시 마포구',
    date: '2023-04-24',
    description: '파란색 목줄을 하고 있으며, 사람을 잘 따릅니다.',
    image: '/placeholder.svg?height=200&width=200',
    user: {
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
    },
    status: 'active',
  },
  {
    id: '3',
    name: '나비',
    type: 'missing',
    animalType: '고양이',
    breed: '페르시안',
    gender: '암컷',
    age: '5세',
    color: '회색',
    location: '서울시 송파구',
    date: '2023-04-23',
    description: '긴 털을 가진 회색 페르시안 고양이입니다. 오른쪽 눈 위에 작은 흉터가 있습니다.',
    image: '/placeholder.svg?height=200&width=200',
    user: {
      name: '박지민',
      email: 'park@example.com',
      phone: '010-3456-7890',
    },
    status: 'matched',
  },
  {
    id: '4',
    name: '루시',
    type: 'found',
    animalType: '고양이',
    breed: '러시안 블루',
    gender: '수컷',
    age: '1세 추정',
    color: '회색/푸른빛',
    location: '서울시 용산구',
    date: '2023-04-23',
    description: '목줄이 없으며, 사람을 경계합니다. 왼쪽 앞발을 약간 절뚝거립니다.',
    image: '/placeholder.svg?height=200&width=200',
    user: {
      name: '최유진',
      email: 'choi@example.com',
      phone: '010-4567-8901',
    },
    status: 'matched',
  },
  {
    id: '5',
    name: '해피',
    type: 'missing',
    animalType: '강아지',
    breed: '골든 리트리버',
    gender: '수컷',
    age: '4세',
    color: '황금색',
    location: '서울시 강서구',
    date: '2023-04-22',
    description: '갈색 가죽 목줄을 하고 있으며, 꼬리가 매우 길고 털이 풍성합니다.',
    image: '/placeholder.svg?height=200&width=200',
    user: {
      name: '정민수',
      email: 'jung@example.com',
      phone: '010-5678-9012',
    },
    status: 'inactive',
  },
];

export default function AnimalsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 검색 및 필터링된 동물 목록
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'missing') return matchesSearch && animal.type === 'missing';
    if (activeTab === 'found') return matchesSearch && animal.type === 'found';
    if (activeTab === 'matched') return matchesSearch && animal.status === 'matched';
    if (activeTab === 'inactive') return matchesSearch && animal.status === 'inactive';

    return matchesSearch;
  });

  const handleView = (animal: any) => {
    setSelectedAnimal(animal);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (animal: any) => {
    setSelectedAnimal(animal);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (animal: any) => {
    setSelectedAnimal(animal);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">실종/보호 동물 목록 관리</h1>
          <p className="text-muted-foreground">등록된 실종/보호 동물 정보를 관리합니다.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          신규 등록
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>동물 목록</CardTitle>
            <CardDescription>총 {animals.length}마리의 동물이 등록되어 있습니다.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              필터
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름, 품종, 지역으로 검색..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="missing">실종</TabsTrigger>
              <TabsTrigger value="found">보호</TabsTrigger>
              <TabsTrigger value="matched">매칭됨</TabsTrigger>
              <TabsTrigger value="inactive">비활성</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>동물 정보</TableHead>
                <TableHead>종류</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>등록자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={animal.image || '/placeholder.svg'} alt={animal.name} />
                        <AvatarFallback>{animal.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{animal.name}</p>
                        <p className="text-sm text-muted-foreground">{animal.breed}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{animal.animalType}</TableCell>
                  <TableCell>{animal.location}</TableCell>
                  <TableCell>{animal.date}</TableCell>
                  <TableCell>{animal.user.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        animal.status === 'matched'
                          ? 'success'
                          : animal.status === 'inactive'
                            ? 'destructive'
                            : animal.type === 'missing'
                              ? 'destructive'
                              : 'default'
                      }
                    >
                      {animal.status === 'matched' ? '매칭됨' : animal.status === 'inactive' ? '비활성' : animal.type === 'missing' ? '실종' : '보호'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleView(animal)}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세 정보 보기
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(animal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          정보 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(animal)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 상세 정보 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>동물 상세 정보</DialogTitle>
            <DialogDescription>등록된 동물의 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedAnimal && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-40 w-40">
                  <AvatarImage src={selectedAnimal.image || '/placeholder.svg'} alt={selectedAnimal.name} />
                  <AvatarFallback>{selectedAnimal.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>이름</Label>
                  <p className="mt-1 font-medium">{selectedAnimal.name}</p>
                </div>
                <div>
                  <Label>상태</Label>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selectedAnimal.status === 'matched'
                          ? 'success'
                          : selectedAnimal.status === 'inactive'
                            ? 'destructive'
                            : selectedAnimal.type === 'missing'
                              ? 'destructive'
                              : 'default'
                      }
                    >
                      {selectedAnimal.status === 'matched'
                        ? '매칭됨'
                        : selectedAnimal.status === 'inactive'
                          ? '비활성'
                          : selectedAnimal.type === 'missing'
                            ? '실종'
                            : '보호'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label>종류</Label>
                  <p className="mt-1">{selectedAnimal.animalType}</p>
                </div>
                <div>
                  <Label>품종</Label>
                  <p className="mt-1">{selectedAnimal.breed}</p>
                </div>
                <div>
                  <Label>성별</Label>
                  <p className="mt-1">{selectedAnimal.gender}</p>
                </div>
                <div>
                  <Label>나이</Label>
                  <p className="mt-1">{selectedAnimal.age}</p>
                </div>
                <div>
                  <Label>색상</Label>
                  <p className="mt-1">{selectedAnimal.color}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p>{selectedAnimal.location}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p>{selectedAnimal.date}</p>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <p>{selectedAnimal.user.name}</p>
                </div>
                <div className="col-span-2">
                  <Label>설명</Label>
                  <p className="mt-1">{selectedAnimal.description}</p>
                </div>
                <div className="col-span-2">
                  <Label>등록자 연락처</Label>
                  <div className="mt-1 space-y-1">
                    <p>이메일: {selectedAnimal.user.email}</p>
                    <p>전화번호: {selectedAnimal.user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 정보 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>동물 정보 수정</DialogTitle>
            <DialogDescription>등록된 동물의 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {selectedAnimal && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" defaultValue={selectedAnimal.name} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="status">상태</Label>
                  <select
                    id="status"
                    defaultValue={selectedAnimal.status}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="active">활성</option>
                    <option value="matched">매칭됨</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="animalType">종류</Label>
                  <Input id="animalType" defaultValue={selectedAnimal.animalType} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="breed">품종</Label>
                  <Input id="breed" defaultValue={selectedAnimal.breed} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="gender">성별</Label>
                  <select
                    id="gender"
                    defaultValue={selectedAnimal.gender}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="수컷">수컷</option>
                    <option value="암컷">암컷</option>
                    <option value="미상">미상</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="age">나이</Label>
                  <Input id="age" defaultValue={selectedAnimal.age} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="color">색상</Label>
                  <Input id="color" defaultValue={selectedAnimal.color} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">위치</Label>
                  <Input id="location" defaultValue={selectedAnimal.location} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="date">등록일</Label>
                  <Input id="date" type="date" defaultValue={selectedAnimal.date} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">설명</Label>
                  <textarea
                    id="description"
                    defaultValue={selectedAnimal.description}
                    className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>동물 정보 삭제</DialogTitle>
            <DialogDescription>정말로 이 동물 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedAnimal && (
            <div className="py-4">
              <p>
                <span className="font-semibold">{selectedAnimal.name}</span>({selectedAnimal.breed}) 정보를 삭제합니다.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
