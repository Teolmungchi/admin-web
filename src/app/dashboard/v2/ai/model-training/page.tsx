'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCw, Upload } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

export default function ModelTraining() {
  const { toast } = useToast();
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [modelName, setModelName] = useState('');
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [baseModel, setBaseModel] = useState('clip-vit-base-patch32');
  const [newModelName, setNewModelName] = useState('');
  const [learningRate, setLearningRate] = useState(0.0001);
  const [finetuneEpochs, setFinetuneEpochs] = useState(5);
  const [existingModels, setExistingModels] = useState<any[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // 기존 모델 목록 가져오기
    fetchModels();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const simulateProgress = () => {
    // 실제 API에서는 웹소켓이나 폴링으로 진행 상황을 받아올 수 있습니다.
    // 여기서는 시뮬레이션으로 진행 상황을 표시합니다.
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);
    return interval;
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
    setIsTraining(true);

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('model_name', modelName);
      formData.append('base_model', baseModel);
      formData.append('epochs', epochs.toString());
      formData.append('batch_size', batchSize.toString());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/api/train`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('모델 학습에 실패했습니다.');
      }

      const result = await response.json();

      // 학습이 완료되면 진행 상황을 100%로 설정
      setTrainingProgress(100);
      setSuccess(`모델 '${result.model_name}'이 성공적으로 학습되었습니다.`);

      // 모델 목록 새로고침
      fetchModels();
    } catch (err) {
      console.error('모델 학습 오류:', err);
      setError('모델 학습 중 오류가 발생했습니다.');
    } finally {
      clearInterval(progressInterval);
      setIsTraining(false);
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
    setIsTraining(true);

    const progressInterval = simulateProgress();

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
        throw new Error('모델 미세조정에 실패했습니다.');
      }

      const result = await response.json();

      // 미세조정이 완료되면 진행 상황을 100%로 설정
      setTrainingProgress(100);
      setSuccess(`모델 '${result.model_name}'이 성공적으로 미세조정되었습니다.`);

      // 모델 목록 새로고침
      fetchModels();
    } catch (err) {
      console.error('모델 미세조정 오류:', err);
      setError('모델 미세조정 중 오류가 발생했습니다.');
    } finally {
      clearInterval(progressInterval);
      setIsTraining(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
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
        </Alert>
      )}

      <Tabs defaultValue="new-training">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-training">새 모델 학습</TabsTrigger>
          <TabsTrigger value="fine-tuning">기존 모델 미세조정</TabsTrigger>
        </TabsList>

        <TabsContent value="new-training">
          <Card>
            <CardHeader>
              <CardTitle>새 CLIP 모델 학습</CardTitle>
              <CardDescription>새로운 이미지 데이터셋으로 CLIP 모델을 학습합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">모델 이름</Label>
                <Input
                  id="model-name"
                  placeholder="모델 이름을 입력하세요"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={isTraining}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base-model-select">기본 모델 선택</Label>
                <select
                  id="base-model-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={baseModel}
                  onChange={(e) => setBaseModel(e.target.value)}
                  disabled={isTraining}
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
                  <Input id="dataset" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isTraining} />
                  <Button variant="outline" onClick={() => document.getElementById('dataset')?.click()} disabled={isTraining}>
                    파일 선택
                  </Button>
                </div>
                {selectedFiles.length > 0 && <p className="text-sm">{selectedFiles.length}개 파일이 선택됨</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="epochs">학습 에포크</Label>
                <Input id="epochs" type="number" value={epochs} onChange={(e) => setEpochs(Number.parseInt(e.target.value))} disabled={isTraining} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch-size">배치 크기</Label>
                <Input
                  id="batch-size"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number.parseInt(e.target.value))}
                  disabled={isTraining}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={startTraining} disabled={isTraining || selectedFiles.length === 0}>
                {isTraining ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    학습 중...
                  </>
                ) : (
                  '학습 시작'
                )}
              </Button>
            </CardFooter>
          </Card>

          {isTraining && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>학습 진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={trainingProgress} className="h-2" />
                <p className="text-right mt-2 text-sm">{trainingProgress}%</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="fine-tuning">
          <Card>
            <CardHeader>
              <CardTitle>기존 모델 미세조정</CardTitle>
              <CardDescription>기존 CLIP 모델을 새로운 데이터로 미세조정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-model">기본 모델 선택</Label>
                <select
                  id="base-model"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedModelId || ''}
                  onChange={(e) => setSelectedModelId(Number.parseInt(e.target.value))}
                  disabled={isTraining}
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
                  disabled={isTraining}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fine-tune-dataset">미세조정 데이터셋</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                  <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">이미지 파일을 드래그하거나 클릭하여 업로드하세요</p>
                  <Input id="fine-tune-dataset" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isTraining} />
                  <Button variant="outline" onClick={() => document.getElementById('fine-tune-dataset')?.click()} disabled={isTraining}>
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
                  disabled={isTraining}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fine-tune-epochs">에포크</Label>
                <Input
                  id="fine-tune-epochs"
                  type="number"
                  value={finetuneEpochs}
                  onChange={(e) => setFinetuneEpochs(Number.parseInt(e.target.value))}
                  disabled={isTraining}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={startFineTuning} disabled={isTraining || selectedFiles.length === 0 || !selectedModelId}>
                {isTraining ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    미세조정 중...
                  </>
                ) : (
                  '미세조정 시작'
                )}
              </Button>
            </CardFooter>
          </Card>

          {isTraining && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>미세조정 진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={trainingProgress} className="h-2" />
                <p className="text-right mt-2 text-sm">{trainingProgress}%</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
