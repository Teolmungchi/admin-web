'use client';

import { useState, useEffect } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Download, Edit, Eye, Filter, MapPin, MoreHorizontal, PlusCircle, Search, Trash2, User } from 'lucide-react';

interface Animal {
  status: 'matched' | 'inactive' | 'active';
  type: 'missing' | 'found';
  // ...other fields
}

function getBadgeVariant(animal: Animal) {
  if (animal.status === 'matched') return 'success';
  if (animal.status === 'inactive') return 'destructive';
  if (animal.type === 'missing') return 'destructive';
  return 'default';
}

function getBadgeText(animal: Animal) {
  if (animal.status === 'matched') return '매칭됨';
  if (animal.status === 'inactive') return '비활성';
  if (animal.type === 'missing') return '실종';
  return '발견';
}

export default function AnimalsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [animals, setAnimals] = useState<any[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    status: '',
    animalType: '',
    breed: '',
    gender: '',
    age: '',
    color: '',
    location: '',
    date: '',
    content: '',
    feature: '',
    fileName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // 동물 목록 가져오기
  const fetchAnimals = async (page: number = 1, limit: number = 100) => {
    try {
      setLoading(true);
      const res = await fetch(`https://tmc.kro.kr/api/v1/admin/all?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`동물 목록을 불러오지 못했습니다: ${res.status}`);

      const { httpStatus, success, data } = await res.json();

      if (httpStatus !== 200 || !success) {
        throw new Error('API 응답이 실패했습니다');
      }

      const mappedAnimals = data.feeds.map((item: any) => {
        // matchingResults 배열에서 FOUND가 있으면 found, 없으면 missing
        const isFound =
          Array.isArray(item.matchingResults) &&
          item.matchingResults.some((result: any) => result.status === 'FOUND');

        return {
          id: item.id,
          name: item.title,
          type: isFound ? 'found' : 'missing',
          animalType: ['샴', '페르시안', '코리안 숏헤어', '러시안 블루'].includes(item.dogType) ? '고양이' : '강아지',
          breed: item.dogType,
          gender: item.dogGender === '남자' || item.dogGender === '남' ? '수컷' : item.dogGender === '여자' || item.dogGender === '여' ? '암컷' : '미상',
          age: item.dogAge ? `${item.dogAge}세` : '알 수 없음',
          color: item.dogColor,
          location: item.lostPlace,
          date: item.lostDate,
          description: item.content,
          feature: item.dogFeature,
          fileName: item.fileName,
          image: item.fileName ? `http://tmc.kro.kr:9000/tmc/${item.fileName}` : '/placeholder.svg?height=200&width=200',
          user: {
            name: item.author.name,
            email: item.author.serialId,
          },
          status: 'active', // 필요시 별도 로직
          matchingResults: item.matchingResults || [],
        };
      });

      setAnimals(mappedAnimals);
      setTotalItems(data.total);
    } catch (e) {
      setError('동물 목록을 불러오는 데 실패했습니다: ' + (e as Error).message);
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchAnimals();
  }, []);

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

  // 상세 정보 보기
  const handleView = (animal: any) => {
    setSelectedAnimal(animal);
    setIsViewDialogOpen(true);
  };

  // 수정 다이얼로그 열기
  const handleEdit = (animal: any) => {
    setSelectedAnimal(animal);
    setEditForm({
      title: animal.name,
      status: animal.status,
      animalType: animal.animalType,
      breed: animal.breed,
      gender: animal.gender,
      age: animal.age.replace('세', '') || '',
      color: animal.color,
      location: animal.location,
      date: animal.date,
      content: animal.description,
      feature: animal.feature,
      fileName: animal.fileName,
    });
    setIsEditDialogOpen(true);
  };

  // 수정 폼 입력 변경
  const handleEditFormChange = (field: string, value: string) => {
    if (field === 'age' && value && !/^\d*$/.test(value)) {
      setError('나이는 숫자여야 합니다.');
      return;
    }
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // 동물 정보 수정 API 호출
  const handleSaveEdit = async () => {
    if (!selectedAnimal) return;
    try {
      const updateData = {
        title: editForm.title,
        content: editForm.content,
        fileName: editForm.fileName,
        lostDate: editForm.date,
        lostPlace: editForm.location,
        placeFeature: editForm.location,
        dogType: editForm.breed,
        dogAge: parseInt(editForm.age) || 0,
        dogGender: editForm.gender === '수컷' ? '남자' : editForm.gender === '암컷' ? '여자' : '미상',
        dogColor: editForm.color,
        dogFeature: editForm.feature,
      };

      const res = await fetch(`https://tmc.kro.kr/api/v1/admin/feeds/${selectedAnimal.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error('동물 정보 수정에 실패했습니다');

      await fetchAnimals();
      setIsEditDialogOpen(false);
      setSuccess('동물 정보가 성공적으로 수정되었습니다.');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (e) {
      setError('동물 정보 수정에 실패했습니다: ' + (e as Error).message);
    }
  };

  // 삭제 다이얼로그 열기
  const handleDelete = (animal: any) => {
    setSelectedAnimal(animal);
    setIsDeleteDialogOpen(true);
  };

  // 동물 정보 삭제 API 호출
  const handleConfirmDelete = async () => {
    if (!selectedAnimal) return;
    try {
      const res = await fetch(`https://tmc.kro.kr/api/v1/admin/feeds/${selectedAnimal.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error('동물 정보 삭제에 실패했습니다');

      await fetchAnimals();
      setIsDeleteDialogOpen(false);
      setSuccess('동물 정보가 성공적으로 삭제되었습니다.');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (e) {
      setError('동물 정보 삭제에 실패했습니다: ' + (e as Error).message);
    }
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
      {success && (
        <Alert variant="default">
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">실종/보호 동물 목록 관리</h1>
          <p className="text-muted-foreground">등록된 실종/보호 동물 정보를 관리합니다.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>동물 목록</CardTitle>
            <CardDescription>총 {totalItems}마리의 동물이 등록되어 있습니다.</CardDescription>
          </div>
          <div className="flex space-x-2">
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
                          ? 'default'       // 또는 'secondary', 원하는 스타일로
                          : animal.status === 'inactive'
                            ? 'destructive'
                            : animal.type === 'missing'
                              ? 'destructive'
                              : 'default'
                      }
                    >
                      {animal.status === 'matched'
                        ? '매칭됨'
                        : animal.status === 'inactive'
                          ? '비활성'
                          : animal.type === 'missing'
                            ? '실종'
                            : '발견'}
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
                {/*<Avatar className="h-40 w-40">*/}
                {/*  /!*<AvatarImage src={animal.image || '/placeholder.svg'} alt={animal.name} />*!/*/}
                {/*  /!*<AvatarFallback>{animal.name.slice(0, 2)}</AvatarFallback>*!/*/}
                {/*</Avatar>*/}
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
                        selectedAnimal.status === 'inactive' || selectedAnimal.type === 'missing'
                          ? 'destructive'
                          : 'default'
                      }
                      className={selectedAnimal.status === 'matched' ? "bg-green-500 text-white" : ""}
                    >
                      {selectedAnimal.status === 'matched'
                        ? '매칭됨'
                        : selectedAnimal.status === 'inactive'
                          ? '비활성'
                          : selectedAnimal.type === 'missing'
                            ? '실종'
                            : '발견'}
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
                  <Label>특징</Label>
                  <p className="mt-1">{selectedAnimal.feature || '없음'}</p>
                </div>
                <div className="col-span-2">
                  <Label>등록자 연락처</Label>
                  <div className="mt-1 space-y-1">
                    <p>이메일: {selectedAnimal.user.email}</p>
                    <p>전화번호: {selectedAnimal.user.phone || '없음'}</p>
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
                  <Label htmlFor="title">이름</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="animalType">종류</Label>
                  <Input
                    id="animalType"
                    value={editForm.animalType}
                    onChange={(e) => handleEditFormChange('animalType', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="breed">품종</Label>
                  <Input
                    id="breed"
                    value={editForm.breed}
                    onChange={(e) => handleEditFormChange('breed', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">성별</Label>
                  <select
                    id="gender"
                    value={editForm.gender}
                    onChange={(e) => handleEditFormChange('gender', e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="수컷">수컷</option>
                    <option value="암컷">암컷</option>
                    <option value="미상">미상</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="age">나이</Label>
                  <Input
                    id="age"
                    value={editForm.age}
                    onChange={(e) => handleEditFormChange('age', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="color">색상</Label>
                  <Input
                    id="color"
                    value={editForm.color}
                    onChange={(e) => handleEditFormChange('color', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">위치</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => handleEditFormChange('location', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date">등록일</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editForm.date}
                    onChange={(e) => handleEditFormChange('date', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">설명</Label>
                  <textarea
                    id="description"
                    value={editForm.content}
                    onChange={(e) => handleEditFormChange('content', e.target.value)}
                    className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="feature">특징</Label>
                  <textarea
                    id="feature"
                    value={editForm.feature}
                    onChange={(e) => handleEditFormChange('feature', e.target.value)}
                    className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveEdit}>저장</Button>
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
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}