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

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://42f5-1-222-60-114.ngrok-free.app';

export default function ModelInfo() {
  const { toast } = useToast();

  // 모델 유형 탭 상태
  const [modelTypeTab, setModelTypeTab] = useState('clip');

  // CLIP 모델 상태
  const [clipActiveModel, setClipActiveModel] = useState<any>(null);
  const [clipModelList, setClipModelList] = useState<any[]>([]);
  const [clipOpenDeleteDialog, setClipOpenDeleteDialog] = useState(false);
  const [clipModelToDelete, setClipModelToDelete] = useState<number | null>(null);
  const [clipIsLoading, setClipIsLoading] = useState(true);
  const [clipError, setClipError] = useState<string | null>(null);
  const [clipSuccess, setClipSuccess] = useState<string | null>(null);

  // 얼굴인식 모델 상태
  const [faceActiveModel, setFaceActiveModel] = useState<any>(null);
  const [faceModelList, setFaceModelList] = useState<any[]>([]);
  const [faceOpenDeleteDialog, setFaceOpenDeleteDialog] = useState(false);
  const [faceModelToDelete, setFaceModelToDelete] = useState<number | null>(null);
  const [faceIsLoading, setFaceIsLoading] = useState(true);
  const [faceError, setFaceError] = useState<string | null>(null);
  const [faceSuccess, setFaceSuccess] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 로드 시 모델 목록 및 활성 모델 가져오기
    fetchClipModels();
    fetchFaceModels();
  }, []);

  // CLIP 모델 관련 함수
  const fetchClipModels = async () => {
    setClipIsLoading(true);
    setClipError(null);

    try {
      // 모든 모델 가져오기
      const modelsResponse = await fetch(`${API_URL}/api/models`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
      if (!modelsResponse.ok) {
        throw new Error('CLIP 모델 목록을 가져오는데 실패했습니다.');
      }
      const modelsData = await modelsResponse.json();
      setClipModelList(modelsData);

      // 활성 모델 가져오기
      try {
        const activeModelResponse = await fetch(`${API_URL}/api/models/active`, {
          headers: {
            'ngrok-skip-browser-warning': '69420',
          },
        });
        if (activeModelResponse.ok) {
          const activeModelData = await activeModelResponse.json();
          setClipActiveModel(activeModelData);
        }
      } catch (err) {
        console.error('활성 CLIP 모델 가져오기 오류:', err);
        // 활성 모델이 없는 경우 무시
      }
    } catch (err) {
      console.error('CLIP 모델 목록 가져오기 오류:', err);
      setClipError('CLIP 모델 목록을 가져오는데 실패했습니다.');
      toast({
        title: '오류',
        description: 'CLIP 모델 목록을 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setClipIsLoading(false);
    }
  };

  const activateClipModel = async (modelId: number) => {
    setClipError(null);
    setClipSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/models/activate/${modelId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (!response.ok) {
        throw new Error('CLIP 모델 활성화에 실패했습니다.');
      }

      // 모델 목록 및 활성 모델 새로고침
      await fetchClipModels();

      setClipSuccess('CLIP 모델이 성공적으로 활성화되었습니다.');
      toast({
        title: '성공',
        description: 'CLIP 모델이 성공적으로 활성화되었습니다.',
      });

      setTimeout(() => setClipSuccess(null), 3000);
    } catch (err) {
      console.error('CLIP 모델 활성화 오류:', err);
      setClipError('CLIP 모델 활성화에 실패했습니다.');
      toast({
        title: '오류',
        description: 'CLIP 모델 활성화에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const deleteClipModel = async () => {
    if (!clipModelToDelete) return;

    setClipError(null);
    setClipSuccess(null);
    setClipOpenDeleteDialog(false);

    try {
      const response = await fetch(`${API_URL}/api/models/${clipModelToDelete}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'CLIP 모델 삭제에 실패했습니다.');
      }

      // 모델 목록 새로고침
      await fetchClipModels();

      setClipSuccess('CLIP 모델이 성공적으로 삭제되었습니다.');
      toast({
        title: '성공',
        description: 'CLIP 모델이 성공적으로 삭제되었습니다.',
      });

      setTimeout(() => setClipSuccess(null), 3000);
    } catch (err: any) {
      console.error('CLIP 모델 삭제 오류:', err);
      setClipError(err.message || 'CLIP 모델 삭제에 실패했습니다.');
      toast({
        title: '오류',
        description: err.message || 'CLIP 모델 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setClipModelToDelete(null);
    }
  };

  const exportClipModel = async (modelName: string) => {
    toast({
      title: '알림',
      description: `CLIP 모델 '${modelName}'을 내보내는 중입니다. 이 기능은 실제 구현 시 서버에서 처리됩니다.`,
    });
  };

  // 얼굴인식 모델 관련 함수
  const fetchFaceModels = async () => {
    setFaceIsLoading(true);
    setFaceError(null);

    try {
      const modelResponse = await fetch(`${API_URL}/api/models2`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
      if (!modelResponse.ok) {
        throw new Error('얼굴인식 모델 목록을 가져오는데 실패했습니다.');
      }
      const modelData = await modelResponse.json();
      setFaceModelList(modelData);

      try {
        const activeModelResponse = await fetch(`${API_URL}/api/models2/active`, {
          headers: {
            'ngrok-skip-browser-warning': '69420',
          },
        });
        if (activeModelResponse.ok) {
          const activeModelData = await activeModelResponse.json();
          setFaceActiveModel(activeModelData);
        }
      } catch (err) {
        console.error('활성 얼굴인식 모델 가져오기 오류:', err);
        // 활성 모델이 없는 경우 무시
      }
    } catch (err) {
      console.error('얼굴인식 모델 목록 가져오기 오류:', err);
      setFaceError('얼굴인식 모델 목록을 가져오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '얼굴인식 모델 목록을 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
    setFaceIsLoading(false);
  };

  const activateFaceModel = async (modelId: number) => {
    setFaceError(null);
    setFaceSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/models2/activate/${modelId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (!response.ok) {
        throw new Error('얼굴인식 모델 활성화에 실패했습니다.');
      }

      await fetchFaceModels();

      setFaceSuccess('얼굴인식 모델이 성공적으로 활성화되었습니다.');
      toast({
        title: '성공',
        description: '얼굴인식 모델이 성공적으로 활성화되었습니다.',
      });
    } catch (err) {
      console.error('얼굴인식 모델 활성화 오류:', err);
      setFaceError('얼굴인식 모델 활성화에 실패했습니다.');
      toast({
        title: '오류',
        description: '얼굴인식 모델 활성화에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const deleteFaceModel = async () => {
    if (!faceModelToDelete) return;

    setFaceError(null);
    setFaceSuccess(null);
    setFaceOpenDeleteDialog(false);

    try {
      const response = await fetch(`${API_URL}/api/models2/${faceModelToDelete}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '얼굴인식 모델 삭제에 실패했습니다.');
      }

      await fetchFaceModels();

      setFaceSuccess('얼굴인식 모델이 성공적으로 삭제되었습니다.');
      toast({
        title: '성공',
        description: '얼굴인식 모델이 성공적으로 삭제되었습니다.',
      });
    } catch (err: any) {
      console.error('얼굴인식 모델 삭제 오류:', err);
      setFaceError(err.message || '얼굴인식 모델 삭제에 실패했습니다.');
      toast({
        title: '오류',
        description: err.message || '얼굴인식 모델 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setFaceModelToDelete(null);
    }
  };

  const exportFaceModel = async (modelName: string) => {
    toast({
      title: '알림',
      description: `얼굴인식 모델 '${modelName}'을 내보내는 중입니다. 이 기능은 실제 구현 시 서버에서 처리됩니다.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">모델 정보</h1>
      </div>

      <Tabs value={modelTypeTab} onValueChange={setModelTypeTab} className="">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="clip">유사도 추출 모델</TabsTrigger>
          {/*<TabsTrigger value="face">얼굴인식 모델</TabsTrigger>*/}
        </TabsList>
      </Tabs>

      {/* CLIP 모델 탭 내용 */}
      {modelTypeTab === 'clip' && (
        <>
          {clipError && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{clipError}</AlertDescription>
            </Alert>
          )}

          {clipSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle>성공</AlertTitle>
              <AlertDescription>{clipSuccess}</AlertDescription>
            </Alert>
          )}

          {clipIsLoading ? (
            <Card>
              <CardContent className="py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
                <p className="text-center mt-4">CLIP 모델 정보를 불러오는 중...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                <TabsTrigger value="active">활성 모델</TabsTrigger>
                <TabsTrigger value="all">모든 모델</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {clipActiveModel ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>현재 활성 유사도 추출 모델</CardTitle>
                      <CardDescription>현재 API에서 사용 중인 활성 유사도 추출 모델 정보입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">모델 이름</h3>
                          <p className="text-lg font-semibold">{clipActiveModel.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">기본 모델</h3>
                          <p className="text-lg">{clipActiveModel.base_model}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">생성일</h3>
                          <p className="text-lg">{clipActiveModel.created_at}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">정확도</h3>
                          <p className="text-lg">{clipActiveModel.accuracy * 100}%</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">모델 크기</h3>
                          <p className="text-lg">{clipActiveModel.size}</p>
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
                              "model": "${clipActiveModel.name}"
                            }`}
                        </pre>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => exportClipModel(clipActiveModel.name)}>
                        <Download className="mr-2 h-4 w-4" />
                        모델 내보내기
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-10">
                      <p className="text-center text-muted-foreground">활성화된 CLIP 모델이 없습니다. '모든 모델' 탭에서 모델을 활성화해주세요.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>유사도 추출 모델</CardTitle>
                    <CardDescription>시스템에 저장된 모든 모델 목록입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {clipModelList.length > 0 ? (
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
                          {clipModelList.map((model) => (
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
                                    <Button variant="outline" size="sm" onClick={() => activateClipModel(model.id)}>
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="sr-only">활성화</span>
                                    </Button>
                                  )}
                                  <Dialog
                                    open={clipOpenDeleteDialog && clipModelToDelete === model.id}
                                    onOpenChange={(open) => {
                                      setClipOpenDeleteDialog(open);
                                      if (!open) setClipModelToDelete(null);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setClipModelToDelete(model.id)}
                                        disabled={model.status === 'active'}
                                      >
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
                                        <Button variant="outline" onClick={() => setClipOpenDeleteDialog(false)}>
                                          취소
                                        </Button>
                                        <Button variant="destructive" onClick={deleteClipModel}>
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
                      <p className="text-center py-6 text-muted-foreground">저장된 CLIP 모델이 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      {/* 얼굴인식 모델 탭 내용 */}
      {modelTypeTab === 'face' && (
        <>
          {faceError && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{faceError}</AlertDescription>
            </Alert>
          )}

          {faceSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle>성공</AlertTitle>
              <AlertDescription>{faceSuccess}</AlertDescription>
            </Alert>
          )}

          {faceIsLoading ? (
            <Card>
              <CardContent className="py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
                <p className="text-center mt-4">얼굴인식 모델 정보를 불러오는 중...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                <TabsTrigger value="active">활성 모델</TabsTrigger>
                <TabsTrigger value="all">모든 모델</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {faceActiveModel ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>현재 활성 얼굴인식 모델</CardTitle>
                      <CardDescription>현재 API에서 사용 중인 활성 얼굴인식 모델 정보입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">모델 이름</h3>
                          <p className="text-lg font-semibold">{faceActiveModel.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">기본 모델</h3>
                          <p className="text-lg">{faceActiveModel.base_model}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">생성일</h3>
                          <p className="text-lg">{faceActiveModel.created_at}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">정확도</h3>
                          <p className="text-lg">{faceActiveModel.accuracy * 100}%</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">모델 크기</h3>
                          <p className="text-lg">{faceActiveModel.size}</p>
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
                          {`POST /api/face-recognition
                            Content-Type: multipart/form-data
                            
                            {
                              "image": [binary data],
                              "model": "${faceActiveModel.name}"
                            }`}
                        </pre>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => exportFaceModel(faceActiveModel.name)}>
                        <Download className="mr-2 h-4 w-4" />
                        모델 내보내기
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-10">
                      <p className="text-center text-muted-foreground">
                        활성화된 얼굴인식 모델이 없습니다. '모든 모델' 탭에서 모델을 활성화해주세요.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>얼굴인식 모델</CardTitle>
                    <CardDescription>시스템에 저장된 모든 모델 목록입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {faceModelList.length > 0 ? (
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
                          {faceModelList.map((model) => (
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
                                    <Button variant="outline" size="sm" onClick={() => activateFaceModel(model.id)}>
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="sr-only">활성화</span>
                                    </Button>
                                  )}
                                  <Dialog
                                    open={faceOpenDeleteDialog && faceModelToDelete === model.id}
                                    onOpenChange={(open) => {
                                      setFaceOpenDeleteDialog(open);
                                      if (!open) setFaceModelToDelete(null);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFaceModelToDelete(model.id)}
                                        disabled={model.status === 'active'}
                                      >
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
                                        <Button variant="outline" onClick={() => setFaceOpenDeleteDialog(false)}>
                                          취소
                                        </Button>
                                        <Button variant="destructive" onClick={deleteFaceModel}>
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
                      <p className="text-center py-6 text-muted-foreground">저장된 얼굴인식 모델이 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
