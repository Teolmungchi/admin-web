'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Plus, Shield, Trash2 } from 'lucide-react';

// 샘플 역할 데이터
const roles = [
  {
    id: '1',
    name: '슈퍼 관리자',
    description: '모든 권한을 가진 최고 관리자',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'animals.view',
      'animals.create',
      'animals.edit',
      'animals.delete',
      'ai.view',
      'ai.manage',
    ],
    userCount: 2,
  },
  {
    id: '2',
    name: '일반 관리자',
    description: '일반적인 관리 권한을 가진 관리자',
    permissions: ['users.view', 'users.create', 'users.edit', 'animals.view', 'animals.create', 'animals.edit', 'ai.view'],
    userCount: 5,
  },
  {
    id: '3',
    name: '동물 관리자',
    description: '동물 데이터 관리 권한만 가진 관리자',
    permissions: ['animals.view', 'animals.create', 'animals.edit', 'animals.delete'],
    userCount: 8,
  },
  {
    id: '4',
    name: 'AI 관리자',
    description: 'AI 모델 관리 권한만 가진 관리자',
    permissions: ['ai.view', 'ai.manage'],
    userCount: 3,
  },
];

// 권한 그룹
const permissionGroups = [
  {
    name: '사용자 관리',
    permissions: [
      { id: 'users.view', label: '사용자 조회' },
      { id: 'users.create', label: '사용자 생성' },
      { id: 'users.edit', label: '사용자 수정' },
      { id: 'users.delete', label: '사용자 삭제' },
    ],
  },
  {
    name: '동물 데이터 관리',
    permissions: [
      { id: 'animals.view', label: '동물 데이터 조회' },
      { id: 'animals.create', label: '동물 데이터 생성' },
      { id: 'animals.edit', label: '동물 데이터 수정' },
      { id: 'animals.delete', label: '동물 데이터 삭제' },
    ],
  },
  {
    name: 'AI 모델 관리',
    permissions: [
      { id: 'ai.view', label: 'AI 모델 조회' },
      { id: 'ai.manage', label: 'AI 모델 관리' },
    ],
  },
];

export default function RolesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleCreateRole = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setSelectedPermissions([]);
    setIsCreateDialogOpen(true);
  };

  const handleViewRole = (role: any) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setSelectedPermissions(role.permissions);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRole = (role: any) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => (prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">관리자 역할/권한 관리</h1>
          <p className="text-muted-foreground">관리자 역할과 권한을 관리합니다.</p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" />새 역할 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>역할 목록</CardTitle>
          <CardDescription>시스템에 정의된 관리자 역할 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>역할 이름</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>권한 수</TableHead>
                <TableHead>사용자 수</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.permissions.length}</TableCell>
                  <TableCell>{role.userCount}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewRole(role)}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세 정보 보기
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          역할 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRole(role)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          역할 삭제
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

      {/* 역할 생성 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 역할 추가</DialogTitle>
            <DialogDescription>새로운 관리자 역할과 권한을 정의합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                역할 이름
              </Label>
              <Input
                id="name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="col-span-3"
                placeholder="역할 이름을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Input
                id="description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                className="col-span-3"
                placeholder="역할에 대한 설명을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">권한</Label>
              <div className="col-span-3 space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <h4 className="font-medium">{group.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={permission.id}>{permission.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 역할 상세 정보 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>역할 상세 정보</DialogTitle>
            <DialogDescription>역할의 상세 정보와 권한을 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">역할 이름</Label>
                <div className="col-span-3">
                  <p>{selectedRole.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">설명</Label>
                <div className="col-span-3">
                  <p>{selectedRole.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">사용자 수</Label>
                <div className="col-span-3">
                  <p>{selectedRole.userCount}명</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">권한</Label>
                <div className="col-span-3 space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                      <h4 className="font-medium">{group.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {group.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox id={`view-${permission.id}`} checked={selectedRole.permissions.includes(permission.id)} disabled />
                            <Label htmlFor={`view-${permission.id}`}>{permission.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 역할 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>역할 수정</DialogTitle>
            <DialogDescription>역할의 정보와 권한을 수정합니다.</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  역할 이름
                </Label>
                <Input id="edit-name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  설명
                </Label>
                <Input
                  id="edit-description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">권한</Label>
                <div className="col-span-3 space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                      <h4 className="font-medium">{group.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {group.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                            <Label htmlFor={`edit-${permission.id}`}>{permission.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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

      {/* 역할 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>역할 삭제</DialogTitle>
            <DialogDescription>정말로 이 역할을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="py-4">
              <p>
                <span className="font-semibold">{selectedRole.name}</span> 역할을 삭제합니다.
              </p>
              <p className="text-sm text-muted-foreground mt-2">이 역할에 속한 {selectedRole.userCount}명의 사용자는 기본 역할로 변경됩니다.</p>
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
