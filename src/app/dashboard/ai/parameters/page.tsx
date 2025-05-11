'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, History, Save } from 'lucide-react'; // 샘플 파라미터 데이터

// 샘플 파라미터 데이터
const parameters = {
  matching: {
    similarityThreshold: 70,
    featureWeights: {
      breed: 0.3,
      color: 0.25,
      size: 0.2,
      age: 0.1,
      location: 0.15,
    },
    enableAutoMatching: true,
    autoMatchThreshold: 85,
    maxSuggestions: 5,
  },
  processing: {
    imageResolution: 512,
    enableEnhancement: true,
    enhancementLevel: 2,
    noiseReduction: 0.5,
    featureExtraction: {
      minFeatures: 50,
      qualityThreshold: 0.6,
    },
  },
  system: {
    maxConcurrentProcessing: 10,
    cacheResults: true,
    cacheDuration: 24, // hours
    logLevel: 'info',
    enableMetrics: true,
  },
};

export default function AIParametersPage() {
  const [currentParams, setCurrentParams] = useState({ ...parameters });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = () => {
    setSaveStatus('saving');
    setIsSaveDialogOpen(true);

    // 저장 시뮬레이션
    setTimeout(() => {
      setSaveStatus('success');
    }, 1500);
  };

  const handleReset = () => {
    setCurrentParams({ ...parameters });
    setIsResetDialogOpen(false);
  };

  const updateMatchingParam = (key: string, value: any) => {
    setCurrentParams({
      ...currentParams,
      matching: {
        ...currentParams.matching,
        [key]: value,
      },
    });
  };

  const updateFeatureWeight = (key: string, value: number) => {
    setCurrentParams({
      ...currentParams,
      matching: {
        ...currentParams.matching,
        featureWeights: {
          ...currentParams.matching.featureWeights,
          [key]: value,
        },
      },
    });
  };

  const updateProcessingParam = (key: string, value: any) => {
    setCurrentParams({
      ...currentParams,
      processing: {
        ...currentParams.processing,
        [key]: value,
      },
    });
  };

  const updateFeatureExtraction = (key: string, value: any) => {
    setCurrentParams({
      ...currentParams,
      processing: {
        ...currentParams.processing,
        featureExtraction: {
          ...currentParams.processing.featureExtraction,
          [key]: value,
        },
      },
    });
  };

  const updateSystemParam = (key: string, value: any) => {
    setCurrentParams({
      ...currentParams,
      system: {
        ...currentParams.system,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">설정/파라미터 관리</h1>
          <p className="text-muted-foreground">AI 모델의 설정과 파라미터를 관리합니다.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsResetDialogOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            초기화
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      <Tabs defaultValue="matching" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matching">매칭 파라미터</TabsTrigger>
          <TabsTrigger value="processing">이미지 처리 파라미터</TabsTrigger>
          <TabsTrigger value="system">시스템 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>매칭 파라미터</CardTitle>
              <CardDescription>AI 유사도 매칭 알고리즘의 파라미터를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="similarityThreshold">유사도 임계값 ({currentParams.matching.similarityThreshold}%)</Label>
                  <span className="text-sm text-muted-foreground">매칭 결과로 표시할 최소 유사도</span>
                </div>
                <Slider
                  id="similarityThreshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[currentParams.matching.similarityThreshold]}
                  onValueChange={(value) => updateMatchingParam('similarityThreshold', value[0])}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>특징 가중치</Label>
                  <span className="text-sm text-muted-foreground">각 특징의 중요도 (총합 1.0)</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(currentParams.matching.featureWeights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`weight-${key}`}>
                          {key === 'breed'
                            ? '품종'
                            : key === 'color'
                              ? '색상'
                              : key === 'size'
                                ? '크기'
                                : key === 'age'
                                  ? '나이'
                                  : key === 'location'
                                    ? '위치'
                                    : key}
                          ({(value * 100).toFixed(0)}%)
                        </Label>
                      </div>
                      <Slider
                        id={`weight-${key}`}
                        min={0}
                        max={1}
                        step={0.05}
                        value={[value]}
                        onValueChange={(val) => updateFeatureWeight(key, val[0])}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableAutoMatching">자동 매칭 활성화</Label>
                <Switch
                  id="enableAutoMatching"
                  checked={currentParams.matching.enableAutoMatching}
                  onCheckedChange={(checked) => updateMatchingParam('enableAutoMatching', checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="autoMatchThreshold">자동 매칭 임계값 ({currentParams.matching.autoMatchThreshold}%)</Label>
                  <span className="text-sm text-muted-foreground">자동으로 매칭할 최소 유사도</span>
                </div>
                <Slider
                  id="autoMatchThreshold"
                  min={0}
                  max={100}
                  step={1}
                  disabled={!currentParams.matching.enableAutoMatching}
                  value={[currentParams.matching.autoMatchThreshold]}
                  onValueChange={(value) => updateMatchingParam('autoMatchThreshold', value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSuggestions">최대 추천 수</Label>
                <Input
                  id="maxSuggestions"
                  type="number"
                  min={1}
                  max={20}
                  value={currentParams.matching.maxSuggestions}
                  onChange={(e) => updateMatchingParam('maxSuggestions', Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">매칭 결과로 표시할 최대 항목 수</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>이미지 처리 파라미터</CardTitle>
              <CardDescription>이미지 처리 및 특징 추출 파라미터를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="imageResolution">이미지 해상도</Label>
                <select
                  id="imageResolution"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentParams.processing.imageResolution}
                  onChange={(e) => updateProcessingParam('imageResolution', Number.parseInt(e.target.value))}
                >
                  <option value={256}>256 x 256</option>
                  <option value={512}>512 x 512</option>
                  <option value={768}>768 x 768</option>
                  <option value={1024}>1024 x 1024</option>
                </select>
                <p className="text-sm text-muted-foreground">처리할 이미지의 해상도</p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableEnhancement">이미지 향상 활성화</Label>
                <Switch
                  id="enableEnhancement"
                  checked={currentParams.processing.enableEnhancement}
                  onCheckedChange={(checked) => updateProcessingParam('enableEnhancement', checked)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="enhancementLevel">이미지 향상 레벨 ({currentParams.processing.enhancementLevel})</Label>
                </div>
                <Slider
                  id="enhancementLevel"
                  min={1}
                  max={5}
                  step={1}
                  disabled={!currentParams.processing.enableEnhancement}
                  value={[currentParams.processing.enhancementLevel]}
                  onValueChange={(value) => updateProcessingParam('enhancementLevel', value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="noiseReduction">노이즈 감소 ({currentParams.processing.noiseReduction})</Label>
                </div>
                <Slider
                  id="noiseReduction"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[currentParams.processing.noiseReduction]}
                  onValueChange={(value) => updateProcessingParam('noiseReduction', value[0])}
                />
                <p className="text-sm text-muted-foreground">이미지 노이즈 감소 강도</p>
              </div>

              <div className="space-y-4">
                <Label>특징 추출 설정</Label>
                <div className="space-y-2">
                  <Label htmlFor="minFeatures">최소 특징 수</Label>
                  <Input
                    id="minFeatures"
                    type="number"
                    min={10}
                    max={200}
                    value={currentParams.processing.featureExtraction.minFeatures}
                    onChange={(e) => updateFeatureExtraction('minFeatures', Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">추출할 최소 특징 포인트 수</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="qualityThreshold">품질 임계값 ({currentParams.processing.featureExtraction.qualityThreshold})</Label>
                  </div>
                  <Slider
                    id="qualityThreshold"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[currentParams.processing.featureExtraction.qualityThreshold]}
                    onValueChange={(value) => updateFeatureExtraction('qualityThreshold', value[0])}
                  />
                  <p className="text-sm text-muted-foreground">특징 포인트의 최소 품질 임계값</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
              <CardDescription>AI 시스템의 일반 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="maxConcurrentProcessing">최대 동시 처리 수</Label>
                <Input
                  id="maxConcurrentProcessing"
                  type="number"
                  min={1}
                  max={50}
                  value={currentParams.system.maxConcurrentProcessing}
                  onChange={(e) => updateSystemParam('maxConcurrentProcessing', Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">동시에 처리할 수 있는 최대 요청 수</p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="cacheResults">결과 캐싱 활성화</Label>
                <Switch
                  id="cacheResults"
                  checked={currentParams.system.cacheResults}
                  onCheckedChange={(checked) => updateSystemParam('cacheResults', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cacheDuration">캐시 유지 시간 (시간)</Label>
                <Input
                  id="cacheDuration"
                  type="number"
                  min={1}
                  max={72}
                  disabled={!currentParams.system.cacheResults}
                  value={currentParams.system.cacheDuration}
                  onChange={(e) => updateSystemParam('cacheDuration', Number.parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">결과를 캐시에 유지할 시간 (시간 단위)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logLevel">로그 레벨</Label>
                <select
                  id="logLevel"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentParams.system.logLevel}
                  onChange={(e) => updateSystemParam('logLevel', e.target.value)}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
                <p className="text-sm text-muted-foreground">시스템 로그 레벨</p>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableMetrics">메트릭 수집 활성화</Label>
                <Switch
                  id="enableMetrics"
                  checked={currentParams.system.enableMetrics}
                  onCheckedChange={(checked) => updateSystemParam('enableMetrics', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 초기화 확인 다이얼로그 */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>설정 초기화</DialogTitle>
            <DialogDescription>모든 설정을 기본값으로 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>주의</AlertTitle>
              <AlertDescription>초기화하면 현재까지 변경한 모든 설정이 기본값으로 돌아갑니다.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 저장 다이얼로그 */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>설정 저장</DialogTitle>
            <DialogDescription>{saveStatus === 'saving' ? '설정을 저장하고 있습니다...' : '설정이 성공적으로 저장되었습니다.'}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {saveStatus === 'saving' ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>저장 완료</AlertTitle>
                <AlertDescription>모든 설정이 성공적으로 저장되었습니다. 변경사항은 즉시 적용됩니다.</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSaveDialogOpen(false)} disabled={saveStatus === 'saving'}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
