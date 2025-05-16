'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RotateCw, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

// localStorage 키 상수
const STORAGE_KEY_JOB_ID = 'pet_finder_current_job_id';
const STORAGE_KEY_JOB_TYPE = 'pet_finder_current_job_type';
const STORAGE_KEY_ACTIVE_TAB = 'pet_finder_active_tab';

export default function ModelTraining() {
  const { toast } = useToast();
  const router = useRouter();

  // 폼 상태
  const [modelName, setModelName] = useState('');
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [baseModel, setBaseModel] = useState('clip-vit-base-patch32');
  const [newModelName, setNewModelName] = useState('');
  const [learningRate, setLearningRate] = useState(0.0001);
  const [finetuneEpochs, setFinetuneEpochs] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 모델 목록 상태
  const [existingModels, setExistingModels] = useState<any[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // 작업 상태
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobResult, setJobResult] = useState<any | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobLogs, setJobLogs] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string | null>(null);

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('new-training');
  const [isInitializing, setIsInitializing] = useState(true);

  // 폴링 간격 (밀리초)
  const POLLING_INTERVAL = 2000;

  useEffect(() => {
    // 기존 모델 목록 가져오기
    fetchModels();

    // localStorage에서 저장된 탭 상태 복원
    const savedTab = localStorage.getItem(STORAGE_KEY_ACTIVE_TAB);
    if (savedTab) {
      setActiveTab(savedTab);
    }

    // localStorage에서 작업 ID 복원
    const savedJobId = localStorage.getItem(STORAGE_KEY_JOB_ID);
    const savedJobType = localStorage.getItem(STORAGE_KEY_JOB_TYPE);

    if (savedJobId) {
      setJobId(savedJobId);
      if (savedJobType) {
        setJobType(savedJobType);
      }
      // 작업 상태 가져오기
      fetchJobStatus(savedJobId);
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTab);
    }
  }, [activeTab, isInitializing]);

  useEffect(() => {
    // 작업 상태 폴링
    let intervalId: NodeJS.Timeout | null = null;

    if (jobId && (jobStatus === 'pending' || jobStatus === 'running')) {
      intervalId = setInterval(() => {
        fetchJobStatus(jobId);
      }, POLLING_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, jobStatus]);

  // 작업 ID가 변경될 때 localStorage에 저장
  useEffect(() => {
    if (!isInitializing) {
      if (jobId && jobType) {
        localStorage.setItem(STORAGE_KEY_JOB_ID, jobId);
        localStorage.setItem(STORAGE_KEY_JOB_TYPE, jobType);
      } else {
        localStorage.removeItem(STORAGE_KEY_JOB_ID);
        localStorage.removeItem(STORAGE_KEY_JOB_TYPE);
      }
    }
  }, [jobId, jobType, isInitializing]);

  const fetchModels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/models`);
      if (!response.ok) {
        throw new Error('모델 목록을 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setExistingModels(data);
      if (data.length > 0) {
        setSelectedModelId(data[0].id);
      }
    } catch (err) {
      console.error('모델 목록 가져오기 오류:', err);
      toast({
        title: '오류',
        description: '모델 목록을 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const fetchJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('작업 상태를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      setJobStatus(data.status);
      setJobProgress(data.progress);
      setJobLogs(data.logs);

      if (data.result) {
        setJobResult(data.result);
      }

      if (data.error) {
        setJobError(data.error);
      }

      // 작업이 완료된 경우
      if (data.status === 'completed') {
        setSuccess('모델 학습이 완료되었습니다. 모델을 저장하시겠습니까?');
      }

      // 작업이 실패한 경우
      if (data.status === 'failed') {
        setError(`모델 학습에 실패했습니다: ${data.error}`);
      }
    } catch (err) {
      console.error('작업 상태 가져오기 오류:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const startTraining = async () => {
    if (!modelName) {
      setError('모델 이름을 입력해주세요.');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('학습 데이터를 선택해주세요.');
      return;
    }

    setError(null);
    setSuccess(null);
    setJobId(null);
    setJobStatus(null);
    setJobProgress(0);
    setJobResult(null);
    setJobError(null);
    setJobLogs([]);
    setJobType(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('model_name', modelName);
      formData.append('base_model', baseModel);
      formData.append('epochs', epochs.toString());
      formData.append('batch_size', batchSize.toString());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      let response;
      if (baseModel.includes('clip-vit-base-patch16')) {
        response = await fetch(`${API_URL}/api/train2`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/api/train`, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error('모델 학습 작업 시작에 실패했습니다.');
      }

      const result = await response.json();
      setJobId(result.job_id);
      setJobStatus('pending');
      setJobType('train');

      toast({
        title: '작업 시작',
        description: '모델 학습 작업이 시작되었습니다.',
      });
    } catch (err) {
      console.error('모델 학습 작업 시작 오류:', err);
      setError('모델 학습 작업 시작 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const startFineTuning = async () => {
    if (!newModelName) {
      setError('새 모델 이름을 입력해주세요.');
      return;
    }

    if (!selectedModelId) {
      setError('기본 모델을 선택해주세요.');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('미세조정 데이터를 선택해주세요.');
      return;
    }

    setError(null);
    setSuccess(null);
    setJobId(null);
    setJobStatus(null);
    setJobProgress(0);
    setJobResult(null);
    setJobError(null);
    setJobLogs([]);
    setJobType(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('model_name', newModelName);
      formData.append('base_model_id', selectedModelId.toString());
      formData.append('learning_rate', learningRate.toString());
      formData.append('epochs', finetuneEpochs.toString());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/api/fine-tune`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('모델 미세조정 작업 시작에 실패했습니다.');
      }

      const result = await response.json();
      setJobId(result.job_id);
      setJobStatus('pending');
      setJobType('fine-tune');

      toast({
        title: '작업 시작',
        description: '모델 미세조정 작업이 시작되었습니다.',
      });
    } catch (err) {
      console.error('모델 미세조정 작업 시작 오류:', err);
      setError('모델 미세조정 작업 시작 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const startFaceTraining = async () => {
    if (!modelName) {
      setError('모델 이름을 입력해주세요.');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('학습 데이터를 선택해주세요.');
      return;
    }

    setError(null);
    setSuccess(null);
    setJobId(null);
    setJobStatus(null);
    setJobProgress(0);
    setJobResult(null);
    setJobError(null);
    setJobLogs([]);
    setJobType(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('model_name', modelName);
      formData.append('base_model', baseModel);
      formData.append('epochs', epochs.toString());
      formData.append('batch_size', batchSize.toString());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      let response;
      response = await fetch(`${API_URL}/api/train2`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('모델 학습 작업 시작에 실패했습니다.');
      }

      const result = await response.json();
      setJobId(result.job_id);
      setJobStatus('pending');
      setJobType('face');

      toast({
        title: '작업 시작',
        description: '모델 학습 작업이 시작되었습니다.',
      });
    } catch (err) {
      console.error('모델 학습 작업 시작 오류:', err);
      setError('모델 학습 작업 시작 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const saveModel = async () => {
    if (!jobId || jobStatus !== 'completed' || !jobResult) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}/save-model`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('모델 저장에 실패했습니다.');
      }

      const result = await response.json();
      setSuccess(`모델 '${result.model_name}'이 성공적으로 저장되었습니다.`);

      toast({
        title: '성공',
        description: `모델 '${result.model_name}'이 성공적으로 저장되었습니다.`,
      });

      // 모델 목록 새로고침
      fetchModels();

      // 작업 상태 초기화
      setJobId(null);
      setJobStatus(null);
      setJobProgress(0);
      setJobResult(null);
      setJobError(null);
      setJobLogs([]);
      setJobType(null);
      setIsLoading(false);
    } catch (err) {
      console.error('모델 저장 오류:', err);
      setError('모델 저장 중 오류가 발생했습니다.');
    }
  };

  const cancelTraining = () => {
    // 작업 상태 초기화
    setJobId(null);
    setJobStatus(null);
    setJobProgress(0);
    setJobResult(null);
    setJobError(null);
    setJobLogs([]);
    setJobType(null);
    setIsLoading(false);
    setError(null);
    setSuccess(null);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'running':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <RotateCw className="h-4 w-4 animate-spin" />;
      case 'running':
        return <RotateCw className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">모델 학습</h1>
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
          {jobStatus === 'completed' && jobResult && (
            <div className="mt-2">
              <Button onClick={saveModel} className="mr-2 bg-green-600 hover:bg-green-700">
                모델 저장
              </Button>
              <Button variant="outline" onClick={cancelTraining}>
                취소
              </Button>
            </div>
          )}
        </Alert>
      )}

      {!jobId ? (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-training">새 유사도 추출 모델 학습</TabsTrigger>
            <TabsTrigger value="fine-tuning">기존 유사도 추출 모델 미세조정</TabsTrigger>
            <TabsTrigger value="face-recognition">새 얼굴인식 모델 학습</TabsTrigger>
          </TabsList>

          <TabsContent value="new-training">
            <Card>
              <CardHeader>
                <CardTitle>새로운 유사도 추출 모델 학습</CardTitle>
                <CardDescription>새로운 이미지 데이터셋으로 모델을 학습합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">모델 이름</Label>
                  <Input
                    id="model-name"
                    placeholder="모델 이름을 입력하세요"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base-model-select">기본 모델 선택</Label>
                  <select
                    id="base-model-select"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={baseModel}
                    onChange={(e) => setBaseModel(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="clip-vit-base-patch32">CLIP ViT-B/32</option>
                    <option value="clip-vit-base-patch16">CLIP ViT-B/16</option>
                    <option value="clip-vit-large-patch14">CLIP ViT-L/14</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataset">학습 데이터셋</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                    <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">이미지 파일을 드래그하거나 클릭하여 업로드하세요</p>
                    <Input id="dataset" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isLoading} />
                    <Button variant="outline" onClick={() => document.getElementById('dataset')?.click()} disabled={isLoading}>
                      파일 선택
                    </Button>
                  </div>
                  {selectedFiles.length > 0 && <p className="text-sm">{selectedFiles.length}개 파일이 선택됨</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epochs">학습 에포크</Label>
                  <Input id="epochs" type="number" value={epochs} onChange={(e) => setEpochs(Number.parseInt(e.target.value))} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch-size">배치 크기</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number.parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startTraining} disabled={isLoading || selectedFiles.length === 0}>
                  {isLoading ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      학습 준비 중...
                    </>
                  ) : (
                    '학습 시작'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="fine-tuning">
            <Card>
              <CardHeader>
                <CardTitle>기존 모델 미세조정</CardTitle>
                <CardDescription>기존 유사도 추출 모델을 새로운 데이터로 미세조정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-model">기본 모델 선택</Label>
                  <select
                    id="base-model"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedModelId || ''}
                    onChange={(e) => setSelectedModelId(Number.parseInt(e.target.value))}
                    disabled={isLoading}
                  >
                    {existingModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.base_model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-model-name">새 모델 이름</Label>
                  <Input
                    id="new-model-name"
                    placeholder="미세조정된 모델 이름"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fine-tune-dataset">미세조정 데이터셋</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                    <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">이미지 파일을 드래그하거나 클릭하여 업로드하세요</p>
                    <Input id="fine-tune-dataset" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isLoading} />
                    <Button variant="outline" onClick={() => document.getElementById('fine-tune-dataset')?.click()} disabled={isLoading}>
                      파일 선택
                    </Button>
                  </div>
                  {selectedFiles.length > 0 && <p className="text-sm">{selectedFiles.length}개 파일이 선택됨</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning-rate">학습률</Label>
                  <Input
                    id="learning-rate"
                    type="number"
                    step="0.0001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(Number.parseFloat(e.target.value))}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fine-tune-epochs">에포크</Label>
                  <Input
                    id="fine-tune-epochs"
                    type="number"
                    value={finetuneEpochs}
                    onChange={(e) => setFinetuneEpochs(Number.parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startFineTuning} disabled={isLoading || selectedFiles.length === 0 || !selectedModelId}>
                  {isLoading ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      미세조정 준비 중...
                    </>
                  ) : (
                    '미세조정 시작'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="face-recognition">
            <Card>
              <CardHeader>
                <CardTitle>새로운 얼굴인식 모델 학습</CardTitle>
                <CardDescription>새로운 이미지 데이터셋으로 모델을 학습합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">모델 이름</Label>
                  <Input
                    id="model-name"
                    placeholder="모델 이름을 입력하세요"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base-model-select">기본 모델 선택</Label>
                  <select
                    id="base-model-select"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={baseModel}
                    onChange={(e) => setBaseModel(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="openai/clip-vit-base-patch16">face-recognition-base-model</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataset">학습 데이터셋</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                    <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">이미지 파일을 드래그하거나 클릭하여 업로드하세요</p>
                    <Input id="dataset" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isLoading} />
                    <Button variant="outline" onClick={() => document.getElementById('dataset')?.click()} disabled={isLoading}>
                      파일 선택
                    </Button>
                  </div>
                  {selectedFiles.length > 0 && <p className="text-sm">{selectedFiles.length}개 파일이 선택됨</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epochs">학습 에포크</Label>
                  <Input id="epochs" type="number" value={epochs} onChange={(e) => setEpochs(Number.parseInt(e.target.value))} disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch-size">배치 크기</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number.parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startFaceTraining} disabled={isLoading || selectedFiles.length === 0}>
                  {isLoading ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      학습 준비 중...
                    </>
                  ) : (
                    '학습 시작'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>작업 상태</CardTitle>
                <div className={`flex items-center ${getStatusColor(jobStatus)}`}>
                  {getStatusIcon(jobStatus)}
                  <span className="ml-2">
                    {jobStatus === 'pending' && '대기 중'}
                    {jobStatus === 'running' && '실행 중'}
                    {jobStatus === 'completed' && '완료됨'}
                    {jobStatus === 'failed' && '실패'}
                  </span>
                </div>
              </div>
              <CardDescription>
                작업 ID: {jobId}
                {jobType && <span className="ml-2">({jobType === 'train' ? '새 모델 학습' : '모델 미세조정'})</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>진행 상황:</span>
                  <span>{jobProgress.toFixed(1)}%</span>
                </div>
                <Progress value={jobProgress} className="h-2" />
              </div>

              {jobResult && (
                <div className="space-y-2 border p-4 rounded-md bg-green-50">
                  <h3 className="font-medium">작업 결과</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>모델 이름:</div>
                    <div className="font-medium">{jobResult.model_name}</div>

                    <div>정확도:</div>
                    <div className="font-medium">{(jobResult.accuracy * 100).toFixed(2)}%</div>

                    <div>모델 크기:</div>
                    <div className="font-medium">{jobResult.size}</div>

                    <div>학습 시간:</div>
                    <div className="font-medium">{jobResult.training_time}</div>
                  </div>
                </div>
              )}

              {jobError && (
                <div className="border p-4 rounded-md bg-red-50 text-red-800">
                  <h3 className="font-medium">오류 발생</h3>
                  <p>{jobError}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={cancelTraining} className="w-full">
                {jobStatus === 'completed' || jobStatus === 'failed' ? '새 작업 시작' : '작업 취소'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>작업 로그</CardTitle>
              <CardDescription>작업 진행 상황 및 로그 메시지</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-white p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
                {jobLogs.length > 0 ? (
                  jobLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">로그가 없습니다.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
