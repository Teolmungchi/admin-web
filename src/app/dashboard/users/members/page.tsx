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
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, Download, Edit, Eye, Filter, LogIn, MoreHorizontal, Search, Trash2, UserPlus, Users } from 'lucide-react';

// 샘플 사용자 데이터
const users = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2023-04-25',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-02-10',
    lastLogin: '2023-04-24',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '3',
    name: '박지민',
    email: 'park@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2022-11-05',
    lastLogin: '2023-04-25',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '4',
    name: '최유진',
    email: 'choi@example.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2023-03-20',
    lastLogin: '2023-04-10',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: '5',
    name: '정민수',
    email: 'jung@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2023-01-25',
    lastLogin: '2023-04-23',
    avatar: '/placeholder.svg?height=40&width=40',
  },
];

const userStats = {
  today: {
    newRegistrations: 24,
    activeUsers: 156,
    loginActivity: 89,
    conversionRate: 3.2,
  },
  yesterday: {
    newRegistrations: 18,
    activeUsers: 142,
    loginActivity: 76,
    conversionRate: 2.8,
  },
};

export default function MembersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // API 연동
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://tmc.kro.kr/api/v1/admin/users', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            // 필요시 'Content-Type': 'application/json' 등 추가
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // 데이터 변환
        const mapped = data.map((u: any) => ({
          id: u.user_id,
          name: u.name,
          email: u.serial_id, // serial_id를 email로 사용
          role: u.role,
          status: u.is_login ? 'active' : 'inactive',
          joinDate: u.created_at.slice(0, 10),
          lastLogin: u.updated_at.slice(0, 10),
          avatar: '/placeholder.svg?height=40&width=40',
        }));
        setUsers(mapped);
      } catch (e) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // 검색 필터링
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">회원 목록 및 상세 정보</h1>
          <p className="text-muted-foreground">회원 정보를 조회하고 관리합니다.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          신규 회원 등록
        </Button>
      </div>

      {/* 회원 통계 카드 추가 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 가입</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.today.newRegistrations}</div>
            <div className="flex items-center pt-1">
              {userStats.today.newRegistrations > userStats.yesterday.newRegistrations ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                전일 대비 {Math.abs(userStats.today.newRegistrations - userStats.yesterday.newRegistrations)}명
                {userStats.today.newRegistrations > userStats.yesterday.newRegistrations ? ' 증가' : ' 감소'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.today.activeUsers}</div>
            <div className="flex items-center pt-1">
              {userStats.today.activeUsers > userStats.yesterday.activeUsers ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                전일 대비 {Math.abs(userStats.today.activeUsers - userStats.yesterday.activeUsers)}명
                {userStats.today.activeUsers > userStats.yesterday.activeUsers ? ' 증가' : ' 감소'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">로그인 활동</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.today.loginActivity}</div>
            <div className="flex items-center pt-1">
              {userStats.today.loginActivity > userStats.yesterday.loginActivity ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <p className="text-xs text-muted-foreground">
                전일 대비 {Math.abs(userStats.today.loginActivity - userStats.yesterday.loginActivity)}회
                {userStats.today.loginActivity > userStats.yesterday.loginActivity ? ' 증가' : ' 감소'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/*<Card>*/}
        {/*  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">*/}
        {/*    <CardTitle className="text-sm font-medium">전환율</CardTitle>*/}
        {/*    <UserCheck className="h-4 w-4 text-muted-foreground" />*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <div className="text-2xl font-bold">{userStats.today.conversionRate}%</div>*/}
        {/*    <div className="flex items-center pt-1">*/}
        {/*      {userStats.today.conversionRate > userStats.yesterday.conversionRate ? (*/}
        {/*        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />*/}
        {/*      ) : (*/}
        {/*        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />*/}
        {/*      )}*/}
        {/*      <p className="text-xs text-muted-foreground">*/}
        {/*        전일 대비 {Math.abs(userStats.today.conversionRate - userStats.yesterday.conversionRate).toFixed(1)}%*/}
        {/*        {userStats.today.conversionRate > userStats.yesterday.conversionRate ? ' 증가' : ' 감소'}*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>회원 목록</CardTitle>
            <CardDescription>총 {users.length}명의 회원이 등록되어 있습니다.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* 검색 및 필터 영역 반응형 개선 */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="이름 또는 이메일로 검색..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>

          {/* 테이블 컨테이너에 반응형 스크롤 추가 */}
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회원 정보</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>로그인 상태</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>최근 로그인</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role === 'admin' ? '관리자' : '일반 사용자'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>{user.status === 'active' ? '활성' : '비활성'}</Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleView(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              상세 정보 보기
                            </DropdownMenuItem>
                            {/*<DropdownMenuItem onClick={() => handleEdit(user)}>*/}
                            {/*  <Edit className="mr-2 h-4 w-4" />*/}
                            {/*  정보 수정*/}
                            {/*</DropdownMenuItem>*/}
                            {/*<DropdownMenuItem onClick={() => handleDelete(user)}>*/}
                            {/*  <Trash2 className="mr-2 h-4 w-4" />*/}
                            {/*  회원 삭제*/}
                            {/*</DropdownMenuItem>*/}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원 상세 정보</DialogTitle>
            <DialogDescription>회원의 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>이름</Label>
                  <p className="mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>이메일</Label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>역할</Label>
                  <p className="mt-1">
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'}>
                      {selectedUser.role === 'admin' ? '관리자' : '일반 사용자'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label>로그인 상태</Label>
                  <p className="mt-1">
                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'destructive'}>
                      {selectedUser.status === 'active' ? '활성' : '비활성'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label>가입일</Label>
                  <p className="mt-1">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <Label>최근 로그인</Label>
                  <p className="mt-1">{selectedUser.lastLogin}</p>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogDescription>회원의 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input id="name" defaultValue={selectedUser.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input id="email" defaultValue={selectedUser.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  역할
                </Label>
                <select
                  id="role"
                  defaultValue={selectedUser.role}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="user">일반 사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  로그인 상태
                </Label>
                <select
                  id="status"
                  defaultValue={selectedUser.status}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
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

      {/* 회원 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원 삭제</DialogTitle>
            <DialogDescription>정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p>
                <span className="font-semibold">{selectedUser.name}</span>({selectedUser.email}) 회원을 삭제합니다.
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
