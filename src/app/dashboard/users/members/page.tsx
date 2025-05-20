'use client';

import React from 'react'; // Added missing import
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowDown, ArrowUp, Download, Edit, Eye, Filter, LogIn, MoreHorizontal, Search, Trash2, UserPlus, Users } from 'lucide-react';

// MembersStatsCards Component
const MembersStatsCards = () => {
  const [userStats, setUserStats] = useState({
    todayNew: 0,
    yesterdayNew: 0,
    loginActive: 0,
    last7DaysNew: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('https://tmc.kro.kr/api/v1/admin/user-stats', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setUserStats(data);
      } catch (e) {
        setUserStats({
          todayNew: 0,
          yesterdayNew: 0,
          loginActive: 0,
          last7DaysNew: 0,
          totalUsers: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[120px]">로딩 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">오늘 신규 가입</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.todayNew}</div>
          <div className="flex items-center pt-1">
            {userStats.todayNew > userStats.yesterdayNew ? (
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <p className="text-xs text-muted-foreground">
              어제 대비 {Math.abs(userStats.todayNew - userStats.yesterdayNew)}명
              {userStats.todayNew > userStats.yesterdayNew ? ' 증가' : ' 감소'}
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
          <div className="text-2xl font-bold">{userStats.loginActive}</div>
          <div className="flex items-center pt-1">
            <p className="text-xs text-muted-foreground">현재 로그인 상태 회원 수</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">최근 7일 신규 가입</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.last7DaysNew}</div>
          <div className="flex items-center pt-1">
            <p className="text-xs text-muted-foreground">최근 7일 누적</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 회원 수</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.totalUsers}</div>
          <div className="flex items-center pt-1">
            <p className="text-xs text-muted-foreground">누적 회원 수</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function MembersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string; email: string; role: string; status: string }>({
    name: '',
    email: '',
    role: '',
    status: '',
  });
  const [error, setError] = useState<string | null>(null);

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      const res = await fetch('https://tmc.kro.kr/api/v1/admin/users', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // 데이터 변환
      const mapped = data.map((u: any) => ({
        id: u.user_id,
        name: u.name,
        email: u.serial_id,
        role: u.role,
        status: u.is_login ? 'active' : 'inactive',
        joinDate: u.created_at.slice(0, 10),
        lastLogin: u.updated_at.slice(0, 10),
        avatar: '/placeholder.svg?height=40&width=40',
      }));
      setUsers(mapped);
    } catch (e) {
      setError('사용자 목록을 불러오는 데 실패했습니다.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 사용자 목록 로드
  useEffect(() => {
    fetchUsers();
  }, []);

  // 검색 필터링
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 상세 정보 보기
  const handleView = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  // 수정 다이얼로그 열기
  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  // 회원 정보 수정 API 호출
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      const updateData = {
        name: editForm.name,
        serial_id: editForm.email,
        is_login: editForm.status === 'active' ? 1 : 0,
        role: editForm.role,
      };

      const res = await fetch(`https://tmc.kro.kr/api/v1/admin/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error('Failed to update user');

      // 사용자 목록 갱신
      await fetchUsers();
      setIsEditDialogOpen(false);
      setError(null);
    } catch (e) {
      setError('회원 정보 수정에 실패했습니다.');
    }
  };

  // 삭제 다이얼로그 열기
  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // 회원 삭제 API 호출
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`https://tmc.kro.kr/api/v1/admin/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      // 사용자 목록 갱신
      await fetchUsers();
      setIsDeleteDialogOpen(false);
      setError(null);
    } catch (e) {
      setError('회원 삭제에 실패했습니다.');
    }
  };

  // 수정 폼 입력 변경
  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
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
          <h1 className="text-2xl font-bold tracking-tight">회원 목록 및 상세 정보</h1>
          <p className="text-muted-foreground">회원 정보를 조회하고 관리합니다.</p>
        </div>
      </div>

      {/* 회원 통계 카드 */}
      <MembersStatsCards />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>회원 목록</CardTitle>
            <CardDescription>총 {users.length}명의 회원이 등록되어 있습니다.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-2 mb-4">
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
                            <p
                              className="font-medium">{user.name}</p> {/* Fixed typo: removed stray "I prefer..." comment */}
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role === 'admin' ? '관리자' : '일반 사용자'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={user.status === 'active' ? "bg-green-500 text-white" : ""}
                        >
                          {user.status === 'active' ? '활성' : '비활성'}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              정보 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(user)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              회원 삭제
                            </DropdownMenuItem>
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
                    <Badge
                      variant={selectedUser.status === 'active' ? 'default' : 'destructive'}
                      className={selectedUser.status === 'active' ? "bg-green-500 text-white" : ""}
                    >
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
        <DialogContent className="sm:best practices for avatar imagesmax-w-[425px]">
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
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  value={editForm.email}
                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  역할
                </Label>
                <select
                  id="role"
                  value={editForm.role}
                  onChange={(e) => handleEditFormChange('role', e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                  value={editForm.status}
                  onChange={(e) => handleEditFormChange('status', e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <Button onClick={handleSaveEdit}>저장</Button>
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
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}