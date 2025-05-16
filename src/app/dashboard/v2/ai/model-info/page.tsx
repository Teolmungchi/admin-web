'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

export default function ModelInfo() {
  const { toast } = useToast();
  const [activeModel, setActiveModel] = useState<any>(null);
  const [modelList, setModelList] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 모든 모델 가져오기
      const modelsResponse = await fetch(`${API_URL}/api/models`);
      if (!modelsResponse.ok) {
        throw new Error('모델 목록을 가져오는데 실패했습니다.');
      }
      const modelsData = await modelsResponse.json();
      setModelList(modelsData);

      // 활성 모델 가져오기
      try {
        const activeModelResponse = await fetch(`${API_URL}/api/models/active`);
        if (activeModelResponse.ok) {
          const activeModelData = await activeModelResponse.json();
          setActiveModel(activeModelData);
        }
      } catch (err) {
        console.error('활성 모델 가져오기 오류:', err);
        // 활성 모델이 없는 경우 무시
      }
    } catch (err) {
      console.error('모델 목록 가져오기 오류:', err);
      setError('모델 목록을 가져오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '모델 목록을 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activateModel = async (modelId: number) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/models/activate/${modelId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('모델 활성화에 실패했습니다.');
      }

      // 모델 목록 및 활성 모델 새로고침
      await fetchModels();

      setSuccess('모델이 성공적으로 활성화되었습니다.');
      toast({
        title: '성공',
        description: '모델이 성공적으로 활성화되었습니다.',
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('모델 활성화 오류:', err);
      setError('모델 활성화에 실패했습니다.');
      toast({
        title: '오류',
        description: '모델 활성화에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const deleteModel = async () => {
    if (!modelToDelete) return;

    setError(null);
    setSuccess(null);
    setOpenDeleteDialog(false);

    try {
      const response = await fetch(`${API_URL}/api/models/${modelToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '모델 삭제에 실패했습니다.');
      }

      // 모델 목록 새로고침
      await fetchModels();

      setSuccess('모델이 성공적으로 삭제되었습니다.');
      toast({
        title: '성공',
        description: '모델이 성공적으로 삭제되었습니다.',
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('모델 삭제 오류:', err);
      setError(err.message || '모델 삭제에 실패했습니다.');
      toast({
        title: '오류',
        description: err.message || '모델 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setModelToDelete(null);
    }
  };

  const exportModel = async (modelName: string) => {
    toast({
      title: '알림',
      description: `모델 '${modelName}'을 내보내는 중입니다.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">모델 정보</h1>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
            <p className="text-center mt-4">모델 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">활성 모델</TabsTrigger>
            <TabsTrigger value="all">모든 모델</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeModel ? (
              <Card>
                <CardHeader>
                  <CardTitle>현재 활성 모델</CardTitle>
                  <CardDescription>현재 API에서 사용 중인 활성 모델 정보입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">모델 이름</h3>
                      <p className="text-lg font-semibold">{activeModel.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">기본 모델</h3>
                      <p className="text-lg">{activeModel.base_model}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">생성일</h3>
                      <p className="text-lg">{activeModel.created_at}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">정확도</h3>
                      <p className="text-lg">{activeModel.accuracy * 100}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">모델 크기</h3>
                      <p className="text-lg">{activeModel.size}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">상태</h3>
                      <Badge variant="default" className="bg-green-500">
                        활성
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 bg-muted/20">
                    <h3 className="font-medium mb-2">API 사용 예시</h3>
                    <pre className="text-xs bg-black text-white p-3 rounded overflow-x-auto">
                      {`POST /api/compare-images
Content-Type: multipart/form-data

{
  "image1": [binary data],
  "image2": [binary data],
  "model": "${activeModel.name}"
}`}
                    </pre>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => exportModel(activeModel.name)}>
                    <Download className="mr-2 h-4 w-4" />
                    모델 내보내기
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-10">
                  <p className="text-center text-muted-foreground">활성화된 모델이 없습니다. '모든 모델' 탭에서 모델을 활성화해주세요.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>모든 모델</CardTitle>
                <CardDescription>시스템에 저장된 모든 모델 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {modelList.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>기본 모델</TableHead>
                        <TableHead>생성일</TableHead>
                        <TableHead>정확도</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modelList.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">{model.name}</TableCell>
                          <TableCell>{model.base_model}</TableCell>
                          <TableCell>{model.created_at}</TableCell>
                          <TableCell>{model.accuracy * 100}%</TableCell>
                          <TableCell>
                            {model.status === 'active' ? (
                              <Badge variant="default" className="bg-green-500">
                                활성
                              </Badge>
                            ) : (
                              <Badge variant="outline">비활성</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {model.status !== 'active' && (
                                <Button variant="outline" size="sm" onClick={() => activateModel(model.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sr-only">활성화</span>
                                </Button>
                              )}
                              <Dialog
                                open={openDeleteDialog && modelToDelete === model.id}
                                onOpenChange={(open) => {
                                  setOpenDeleteDialog(open);
                                  if (!open) setModelToDelete(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setModelToDelete(model.id)} disabled={model.status === 'active'}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="sr-only">삭제</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>모델 삭제</DialogTitle>
                                    <DialogDescription>
                                      정말로 "{model.name}" 모델을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                                      취소
                                    </Button>
                                    <Button variant="destructive" onClick={deleteModel}>
                                      삭제
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">저장된 모델이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
