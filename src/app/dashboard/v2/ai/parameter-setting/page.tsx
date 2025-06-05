'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://a730-210-119-237-102.ngrok-free.app';

export default function ParameterSettings() {
  const { toast } = useToast();

  // 추론 파라미터 상태
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75);
  const [topK, setTopK] = useState(5);
  const [useEnhancedFeatures, setUseEnhancedFeatures] = useState(true);
  const [imageSize, setImageSize] = useState(224);

  // 학습 파라미터 상태
  const [learningRate, setLearningRate] = useState(0.0003);
  const [fineTuneLR, setFineTuneLR] = useState(0.00005);
  const [defaultEpochs, setDefaultEpochs] = useState(10);
  const [defaultBatchSize, setDefaultBatchSize] = useState(32);
  const [useAugmentation, setUseAugmentation] = useState(true);

  // UI 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 파라미터 가져오기
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 추론 파라미터 가져오기
      const inferenceResponse = await fetch(`${API_URL}/api/parameters/inference`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
      if (!inferenceResponse.ok) {
        throw new Error('추론 파라미터를 가져오는데 실패했습니다.');
      }
      const inferenceData = await inferenceResponse.json();

      // 추론 파라미터 설정
      setSimilarityThreshold(inferenceData.similarity_threshold);
      setTopK(inferenceData.top_k);
      setUseEnhancedFeatures(inferenceData.enhanced_features);
      setImageSize(inferenceData.image_size);

      // 학습 파라미터 가져오기
      const trainingResponse = await fetch(`${API_URL}/api/parameters/training`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
      if (!trainingResponse.ok) {
        throw new Error('학습 파라미터를 가져오는데 실패했습니다.');
      }
      const trainingData = await trainingResponse.json();

      // 학습 파라미터 설정
      setLearningRate(trainingData.learning_rate);
      setFineTuneLR(trainingData.fine_tune_learning_rate);
      setDefaultEpochs(trainingData.default_epochs);
      setDefaultBatchSize(trainingData.default_batch_size);
      setUseAugmentation(trainingData.use_augmentation);
    } catch (err) {
      console.error('파라미터 가져오기 오류:', err);
      setError('파라미터를 가져오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '파라미터를 가져오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveInferenceParameters = async () => {
    setIsSaving(true);
    setIsSaved(false);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/parameters/inference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify({
          similarity_threshold: similarityThreshold,
          top_k: topK,
          enhanced_features: useEnhancedFeatures,
          image_size: imageSize,
        }),
      });

      if (!response.ok) {
        throw new Error('추론 파라미터 저장에 실패했습니다.');
      }

      setIsSaved(true);
      toast({
        title: '성공',
        description: '추론 파라미터가 성공적으로 저장되었습니다.',
      });

      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('추론 파라미터 저장 오류:', err);
      setError('추론 파라미터 저장에 실패했습니다.');
      toast({
        title: '오류',
        description: '추론 파라미터 저장에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveTrainingParameters = async () => {
    setIsSaving(true);
    setIsSaved(false);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/parameters/training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420',
        },
        body: JSON.stringify({
          learning_rate: learningRate,
          fine_tune_learning_rate: fineTuneLR,
          default_epochs: defaultEpochs,
          default_batch_size: defaultBatchSize,
          use_augmentation: useAugmentation,
        }),
      });

      if (!response.ok) {
        throw new Error('학습 파라미터 저장에 실패했습니다.');
      }

      setIsSaved(true);
      toast({
        title: '성공',
        description: '학습 파라미터가 성공적으로 저장되었습니다.',
      });

      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('학습 파라미터 저장 오류:', err);
      setError('학습 파라미터 저장에 실패했습니다.');
      toast({
        title: '오류',
        description: '학습 파라미터 저장에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">파라미터 수정</h1>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSaved && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle>저장 완료</AlertTitle>
          <AlertDescription>파라미터가 성공적으로 저장되었습니다.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
            <p className="text-center mt-4">파라미터를 불러오는 중...</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="inference">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inference">추론 파라미터</TabsTrigger>
            <TabsTrigger value="training">학습 파라미터</TabsTrigger>
          </TabsList>

          <TabsContent value="inference">
            <Card>
              <CardHeader>
                <CardTitle>추론 파라미터 설정</CardTitle>
                <CardDescription>이미지 유사도 비교 및 검색에 사용되는 파라미터를 조정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="similarity-threshold">유사도 임계값</Label>
                    <span className="text-sm text-muted-foreground">{similarityThreshold}</span>
                  </div>
                  <Slider
                    id="similarity-threshold"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[similarityThreshold]}
                    onValueChange={(value) => setSimilarityThreshold(value[0])}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">두 이미지가 동일한 반려동물로 간주되기 위한 최소 유사도 점수입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="top-k">상위 K 결과</Label>
                  <Input id="top-k" type="number" value={topK} onChange={(e) => setTopK(Number.parseInt(e.target.value))} disabled={isSaving} />
                  <p className="text-xs text-muted-foreground">검색 결과에서 반환할 최대 유사 이미지 수입니다.</p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enhanced-features">향상된 특성 추출</Label>
                  <Switch id="enhanced-features" checked={useEnhancedFeatures} onCheckedChange={setUseEnhancedFeatures} disabled={isSaving} />
                </div>
                <p className="text-xs text-muted-foreground -mt-4">
                  더 정확한 결과를 위해 추가 특성 추출 기법을 사용합니다. 처리 시간이 증가할 수 있습니다.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="image-size">이미지 크기 조정</Label>
                  <Input
                    id="image-size"
                    type="number"
                    value={imageSize}
                    onChange={(e) => setImageSize(Number.parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">모델 입력을 위한 이미지 크기(픽셀)입니다.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={saveInferenceParameters} disabled={isSaving}>
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      파라미터 저장
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>학습 파라미터 설정</CardTitle>
                <CardDescription>모델 학습 및 미세조정에 사용되는 파라미터를 조정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="learning-rate">기본 학습률</Label>
                  <Input
                    id="learning-rate"
                    type="number"
                    step="0.0001"
                    value={learningRate}
                    onChange={(e) => setLearningRate(Number.parseFloat(e.target.value))}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">새 모델 학습 시 사용되는 기본 학습률입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fine-tune-lr">미세조정 학습률</Label>
                  <Input
                    id="fine-tune-lr"
                    type="number"
                    step="0.00001"
                    value={fineTuneLR}
                    onChange={(e) => setFineTuneLR(Number.parseFloat(e.target.value))}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">기존 모델 미세조정 시 사용되는 학습률입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-epochs">기본 에포크</Label>
                  <Input
                    id="default-epochs"
                    type="number"
                    value={defaultEpochs}
                    onChange={(e) => setDefaultEpochs(Number.parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">새 모델 학습 시 사용되는 기본 에포크 수입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-batch">기본 배치 크기</Label>
                  <Input
                    id="default-batch"
                    type="number"
                    value={defaultBatchSize}
                    onChange={(e) => setDefaultBatchSize(Number.parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">학습 시 사용되는 기본 배치 크기입니다.</p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="use-augmentation">데이터 증강 사용</Label>
                  <Switch id="use-augmentation" checked={useAugmentation} onCheckedChange={setUseAugmentation} disabled={isSaving} />
                </div>
                <p className="text-xs text-muted-foreground -mt-4">학습 중 이미지 데이터 증강을 사용하여 모델 일반화 성능을 향상시킵니다.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={saveTrainingParameters} disabled={isSaving}>
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      파라미터 저장
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
