'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Eye,
  HelpCircle,
  History,
  Loader2,
  Pause,
  Play,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
  Square,
  Upload,
  Zap,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(50);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<'running' | 'paused' | 'completed' | 'failed'>('running');

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
      {/* 모바일 화면에서 버튼 레이아웃 개선 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">셜록냥즈 유사도 추출 AI 모델 학습</h1>
          <p className="text-muted-foreground">AI 모델의 학습과 배포를 관리합니다.</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsResetDialogOpen(true)} className="flex-1 sm:flex-none">
            <History className="mr-2 h-4 w-4" />
            초기화
          </Button>
          <Button onClick={handleSave} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      {/* 모델 학습 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>데이터셋 선택</CardTitle>
            <CardDescription>학습에 사용할 데이터셋을 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="데이터셋 검색..." className="pl-8" />
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />새 데이터셋 업로드
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 데이터셋 카드 1 */}
              <div className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">고양이 얼굴 데이터셋</h3>
                    <p className="text-sm text-muted-foreground">15,000개 이미지</p>
                  </div>
                  <Badge>선택됨</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">유형:</p>
                    <p>이미지</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">카테고리:</p>
                    <p>고양이</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">마지막 업데이트:</p>
                    <p>2023-04-15</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">크기:</p>
                    <p>4.2 GB</p>
                  </div>
                </div>
              </div>

              {/* 데이터셋 카드 2 */}
              <div className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">강아지 얼굴 데이터셋</h3>
                    <p className="text-sm text-muted-foreground">12,500개 이미지</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">유형:</p>
                    <p>이미지</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">카테고리:</p>
                    <p>강아지</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">마지막 업데이트:</p>
                    <p>2023-03-22</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">크기:</p>
                    <p>3.8 GB</p>
                  </div>
                </div>
              </div>

              {/* 데이터셋 카드 3 */}
              <div className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">혼합 동물 데이터셋</h3>
                    <p className="text-sm text-muted-foreground">25,000개 이미지</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">유형:</p>
                    <p>이미지</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">카테고리:</p>
                    <p>혼합</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">마지막 업데이트:</p>
                    <p>2023-05-10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">크기:</p>
                    <p>7.5 GB</p>
                  </div>
                </div>
              </div>

              {/* 데이터셋 카드 4 */}
              <div className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">저조도 환경 데이터셋</h3>
                    <p className="text-sm text-muted-foreground">8,000개 이미지</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">유형:</p>
                    <p>이미지</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">카테고리:</p>
                    <p>혼합</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">마지막 업데이트:</p>
                    <p>2023-02-18</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">크기:</p>
                    <p>2.1 GB</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>학습 파라미터</CardTitle>
            <CardDescription>모델 학습을 위한 파라미터를 설정하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modelType">모델 유형</Label>
              <select
                id="modelType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="similarity">유사도 추출 모델</option>
                <option value="face-recognition">얼굴인식 모델</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="epochs">에포크 (Epochs): 50</Label>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <Slider id="epochs" min={1} max={100} step={1} defaultValue={[50]} />
              <p className="text-xs text-muted-foreground">전체 데이터셋을 몇 번 반복해서 학습할지 설정합니다.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="batchSize">배치 크기 (Batch Size): 32</Label>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <select
                id="batchSize"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="32"
              >
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
                <option value="128">128</option>
              </select>
              <p className="text-xs text-muted-foreground">한 번에 처리할 데이터 샘플의 수입니다.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="learningRate">학습률 (Learning Rate): 0.001</Label>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <Slider id="learningRate" min={0.0001} max={0.01} step={0.0001} defaultValue={[0.001]} />
              <p className="text-xs text-muted-foreground">모델이 학습하는 속도를 조절합니다.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableDataAugmentation">데이터 증강 활성화</Label>
                <Switch id="enableDataAugmentation" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">이미지 회전, 반전 등의 데이터 증강 기법을 적용합니다.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableEarlyStopping">조기 종료 활성화</Label>
                <Switch id="enableEarlyStopping" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">검증 손실이 개선되지 않으면 학습을 조기에 종료합니다.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              학습 시작
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 학습 이력 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>학습 이력</CardTitle>
          <CardDescription>이전에 실행된 모델 학습 이력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>모델명</TableHead>
                    <TableHead>데이터셋</TableHead>
                    <TableHead>시작 시간</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>에포크</TableHead>
                    <TableHead>정확도</TableHead>
                    <TableHead>손실</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">얼굴인식 모델 v2.1.0</TableCell>
                    <TableCell>고양이 얼굴 데이터셋</TableCell>
                    <TableCell>2023-05-10 14:20</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">완료</Badge>
                    </TableCell>
                    <TableCell>50/50</TableCell>
                    <TableCell>91.2%</TableCell>
                    <TableCell>0.082</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">유사도 추출 모델 v1.3.2</TableCell>
                    <TableCell>혼합 동물 데이터셋</TableCell>
                    <TableCell>2023-04-15 09:30</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">완료</Badge>
                    </TableCell>
                    <TableCell>75/75</TableCell>
                    <TableCell>89.5%</TableCell>
                    <TableCell>0.105</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">얼굴인식 모델 v2.0.2</TableCell>
                    <TableCell>강아지 얼굴 데이터셋</TableCell>
                    <TableCell>2023-04-05 11:45</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">완료</Badge>
                    </TableCell>
                    <TableCell>60/60</TableCell>
                    <TableCell>88.3%</TableCell>
                    <TableCell>0.124</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">유사도 추출 모델 (테스트)</TableCell>
                    <TableCell>저조도 환경 데이터셋</TableCell>
                    <TableCell>2023-05-15 10:05</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500">진행 중</Badge>
                    </TableCell>
                    <TableCell>28/50</TableCell>
                    <TableCell>85.7%</TableCell>
                    <TableCell>0.142</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Square className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 관리 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 관리</CardTitle>
          <CardDescription>학습 데이터를 관리하고 전처리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">데이터 분할</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="trainSplit">학습 데이터: 70%</Label>
                  </div>
                  <Slider id="trainSplit" min={50} max={90} step={5} defaultValue={[70]} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>검증: 20%</span>
                    <span>테스트: 10%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  데이터 분할 적용
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">데이터 전처리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableNormalization">정규화</Label>
                    <Switch id="enableNormalization" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableResizing">크기 조정</Label>
                    <Switch id="enableResizing" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableNoiseReduction">노이즈 감소</Label>
                    <Switch id="enableNoiseReduction" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  전처리 적용
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">데이터 증강</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableRotation">회전</Label>
                    <Switch id="enableRotation" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableFlipping">반전</Label>
                    <Switch id="enableFlipping" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableColorJitter">색상 변화</Label>
                    <Switch id="enableColorJitter" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  증강 미리보기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 모델 평가 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>모델 평가</CardTitle>
          <CardDescription>학습된 모델의 성능을 평가합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">성능 지표</h3>
                <Badge variant="outline">얼굴인식 모델 v2.1.0</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="text-sm text-muted-foreground">정확도</p>
                      <p className="text-3xl font-bold">91.2%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="text-sm text-muted-foreground">정밀도</p>
                      <p className="text-3xl font-bold">93.5%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="text-sm text-muted-foreground">재현율</p>
                      <p className="text-3xl font-bold">89.8%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="text-sm text-muted-foreground">F1 점수</p>
                      <p className="text-3xl font-bold">91.6%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">학습 곡선</h3>
              <div className="h-[300px] border rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { epoch: 1, train: 0.45, validation: 0.4 },
                      { epoch: 10, train: 0.75, validation: 0.68 },
                      { epoch: 20, train: 0.82, validation: 0.76 },
                      { epoch: 30, train: 0.87, validation: 0.82 },
                      { epoch: 40, train: 0.9, validation: 0.85 },
                      { epoch: 50, train: 0.93, validation: 0.91 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="train" name="학습 정확도" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="validation" name="검증 정확도" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">오차 행렬</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>예측: 고양이</TableHead>
                    <TableHead>예측: 강아지</TableHead>
                    <TableHead>예측: 기타</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">실제: 고양이</TableCell>
                    <TableCell className="bg-green-100">1,250</TableCell>
                    <TableCell className="bg-red-50">45</TableCell>
                    <TableCell className="bg-red-50">25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">실제: 강아지</TableCell>
                    <TableCell className="bg-red-50">38</TableCell>
                    <TableCell className="bg-green-100">980</TableCell>
                    <TableCell className="bg-red-50">32</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">실제: 기타</TableCell>
                    <TableCell className="bg-red-50">22</TableCell>
                    <TableCell className="bg-red-50">28</TableCell>
                    <TableCell className="bg-green-100">580</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            평가 보고서 다운로드
          </Button>
          <Button>
            <Cpu className="mr-2 h-4 w-4" />
            모델 배포
          </Button>
        </CardFooter>
      </Card>

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

      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>모델 학습 진행 상황</DialogTitle>
            <DialogDescription>
              {trainingStatus === 'running' && '모델 학습이 진행 중입니다. 이 과정은 몇 분에서 몇 시간이 소요될 수 있습니다.'}
              {trainingStatus === 'paused' && "모델 학습이 일시 중지되었습니다. 계속하려면 '계속' 버튼을 클릭하세요."}
              {trainingStatus === 'completed' && '모델 학습이 완료되었습니다. 결과를 확인하세요.'}
              {trainingStatus === 'failed' && '모델 학습 중 오류가 발생했습니다. 로그를 확인하세요.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {trainingStatus === 'running' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {trainingStatus === 'paused' && <Pause className="mr-2 h-4 w-4" />}
                  {trainingStatus === 'completed' && <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
                  {trainingStatus === 'failed' && <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />}
                  <span>
                    에포크: {currentEpoch}/{totalEpochs} ({Math.round((currentEpoch / totalEpochs) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>남은 시간: 약 1시간 23분</span>
                </div>
              </div>
              <Progress value={trainingProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">학습 성능</h3>
                <div className="h-[200px] border rounded-lg p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { epoch: 1, accuracy: 0.45, loss: 0.95 },
                        { epoch: 5, accuracy: 0.62, loss: 0.65 },
                        { epoch: 10, accuracy: 0.75, loss: 0.42 },
                        { epoch: 15, accuracy: 0.81, loss: 0.32 },
                        { epoch: 20, accuracy: 0.85, loss: 0.25 },
                        { epoch: 25, accuracy: 0.88, loss: 0.2 },
                        { epoch: 28, accuracy: 0.89, loss: 0.18 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="epoch" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="accuracy" name="정확도" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="loss" name="손실" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">학습 로그</h3>
                <div className="h-[200px] border rounded-lg p-2 overflow-y-auto bg-gray-50 font-mono text-xs">
                  <div className="space-y-1">
                    <p>2023-05-15 10:05:12 - 학습 시작</p>
                    <p>2023-05-15 10:05:15 - 데이터셋 로드 완료: 8,000개 이미지</p>
                    <p>2023-05-15 10:05:20 - 에포크 1/50 시작</p>
                    <p>2023-05-15 10:08:45 - 에포크 1/50 완료 - 손실: 0.952, 정확도: 0.451</p>
                    <p>2023-05-15 10:08:50 - 에포크 2/50 시작</p>
                    <p>...</p>
                    <p>2023-05-15 10:45:30 - 에포크 27/50 완료 - 손실: 0.185, 정확도: 0.887</p>
                    <p>2023-05-15 10:45:35 - 에포크 28/50 시작</p>
                    <p>2023-05-15 10:49:12 - 현재 배치 100/250 처리 중...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">학습 파라미터</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="border rounded-lg p-2">
                  <p className="text-muted-foreground">모델 유형:</p>
                  <p className="font-medium">유사도 추출 모델</p>
                </div>
                <div className="border rounded-lg p-2">
                  <p className="text-muted-foreground">데이터셋:</p>
                  <p className="font-medium">저조도 환경 데이터셋</p>
                </div>
                <div className="border rounded-lg p-2">
                  <p className="text-muted-foreground">배치 크기:</p>
                  <p className="font-medium">32</p>
                </div>
                <div className="border rounded-lg p-2">
                  <p className="text-muted-foreground">학습률:</p>
                  <p className="font-medium">0.001</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            {trainingStatus === 'running' && (
              <>
                <Button variant="outline" onClick={() => setTrainingStatus('paused')}>
                  <Pause className="mr-2 h-4 w-4" />
                  일시 중지
                </Button>
                <Button variant="destructive" onClick={() => setTrainingStatus('failed')}>
                  <Square className="mr-2 h-4 w-4" />
                  중지
                </Button>
              </>
            )}
            {trainingStatus === 'paused' && (
              <>
                <Button variant="outline" onClick={() => setTrainingStatus('running')}>
                  <Play className="mr-2 h-4 w-4" />
                  계속
                </Button>
                <Button variant="destructive" onClick={() => setTrainingStatus('failed')}>
                  <Square className="mr-2 h-4 w-4" />
                  중지
                </Button>
              </>
            )}
            {(trainingStatus === 'completed' || trainingStatus === 'failed') && <Button onClick={() => setIsTrainingDialogOpen(false)}>닫기</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
