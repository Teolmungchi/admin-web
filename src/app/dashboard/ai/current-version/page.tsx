'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calendar, CheckCircle2, Clock, Dog, GitBranch, GitCommit, Package } from 'lucide-react';

// 모델 선택 탭
const modelTypes = [
  { value: 'similarity', label: '유사도 추출 모델' },
  { value: 'face-recognition', label: '얼굴인식 모델' },
];

// 유사도 추출 모델 정보
const similarityModel = {
  version: 'v1.3.2',
  name: '셜록냥즈 유사도 모델',
  status: 'active',
  deployedAt: '2023-04-15 09:30:45',
  uptime: '10일 5시간 22분',
  framework: 'PyTorch 2.0',
  architecture: 'ResNet-50 + Custom Similarity Network',
  inputSize: '512x512',
  parameters: '25.6M',
  size: '98.4 MB',
  accuracy: 0.89,
  precision: 0.92,
  recall: 0.87,
  f1Score: 0.89,
  trainingData: '15,000 이미지 (고양이: 8,500, 강아지: 6,500)',
  validationData: '3,000 이미지',
  author: 'AI 개발팀',
  repository: 'github.com/sherlockcats/similarity-model',
  commit: 'a7b2c3d4e5f6',
  license: 'Proprietary',
};

// 얼굴인식 모델 정보
const faceRecognitionModel = {
  version: 'v2.1.0',
  name: '셜록냥즈 얼굴인식 모델',
  status: 'active',
  deployedAt: '2023-05-10 14:20:30',
  uptime: '5일 8시간 45분',
  framework: 'TensorFlow 2.8',
  architecture: 'EfficientNet-B3 + FaceNet',
  inputSize: '300x300',
  parameters: '18.2M',
  size: '76.5 MB',
  accuracy: 0.91,
  precision: 0.93,
  recall: 0.89,
  f1Score: 0.91,
  trainingData: '22,000 이미지 (고양이: 12,500, 강아지: 9,500)',
  validationData: '4,500 이미지',
  author: 'AI 개발팀',
  repository: 'github.com/sherlockcats/face-recognition-model',
  commit: 'b8c4d5e6f7g',
  license: 'Proprietary',
  supportedAnimals: ['고양이', '강아지'],
};

// 유사도 모델 성능 데이터
const similarityPerformanceData = [
  { name: '정확도', value: 89 },
  { name: '정밀도', value: 92 },
  { name: '재현율', value: 87 },
  { name: 'F1 점수', value: 89 },
];

// 얼굴인식 모델 성능 데이터
const faceRecognitionPerformanceData = [
  { name: '정확도', value: 91 },
  { name: '정밀도', value: 93 },
  { name: '재현율', value: 89 },
  { name: 'F1 점수', value: 91 },
];

// 유사도 모델 동물 유형별 성능
const similarityAnimalTypeData = [
  { name: '고양이', 정확도: 91, 정밀도: 94, 재현율: 89 },
  { name: '강아지', 정확도: 87, 정밀도: 90, 재현율: 85 },
];

// 얼굴인식 모델 동물 유형별 성능
const faceRecognitionAnimalTypeData = [
  { name: '고양이', 정확도: 93, 정밀도: 95, 재현율: 91 },
  { name: '강아지', 정확도: 89, 정밀도: 91, 재현율: 87 },
];

// 유사도 추출 모델 색상별 성능
const similarityColorPerformanceData = [
  { name: '검정', value: 94 },
  { name: '흰색', value: 92 },
  { name: '회색', value: 88 },
  { name: '갈색', value: 86 },
  { name: '혼합', value: 82 },
];

// 얼굴인식 모델 조명별 성능
const faceRecognitionLightingPerformanceData = [
  { name: '밝은 조명', value: 94 },
  { name: '보통 조명', value: 91 },
  { name: '어두운 조명', value: 83 },
  { name: '야외 자연광', value: 88 },
];

// 유사도 모델 업데이트 이력
const similarityUpdateHistory = [
  {
    version: 'v1.3.2',
    date: '2023-04-15',
    changes: ['색상 인식 알고리즘 개선으로 정확도 3% 향상', '혼합 색상 동물 인식 성능 개선', '처리 속도 15% 향상'],
  },
  {
    version: 'v1.3.1',
    date: '2023-03-22',
    changes: ['특징점 추출 알고리즘 업데이트', '작은 크기의 동물 인식 성능 개선', '메모리 사용량 최적화'],
  },
  {
    version: 'v1.3.0',
    date: '2023-02-10',
    changes: ['새로운 ResNet-50 백본 모델 적용', '3,000개의 새로운 훈련 이미지 추가', '유사도 계산 알고리즘 개선'],
  },
];

// 얼굴인식 모델 업데이트 이력
const faceRecognitionUpdateHistory = [
  {
    version: 'v2.1.0',
    date: '2023-05-10',
    changes: ['강아지 얼굴 인식 정확도 개선', '다양한 각도에서의 인식률 향상', '처리 속도 20% 개선'],
  },
  {
    version: 'v2.0.2',
    date: '2023-04-05',
    changes: ['저조도 환경에서의 인식 성능 개선', '얼굴 특징점 추출 알고리즘 업데이트', '메모리 사용량 최적화'],
  },
  {
    version: 'v2.0.1',
    date: '2023-03-12',
    changes: ['강아지 얼굴 인식 지원 추가', '5,000개의 강아지 훈련 이미지 추가', '모델 아키텍처 개선'],
  },
];

// 차트 색상
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

export default function CurrentVersionPage() {
  const [selectedModelType, setSelectedModelType] = useState('similarity');

  // 선택된 모델 정보
  const currentModel = selectedModelType === 'similarity' ? similarityModel : faceRecognitionModel;
  const performanceData = selectedModelType === 'similarity' ? similarityPerformanceData : faceRecognitionPerformanceData;
  const animalTypeData = selectedModelType === 'similarity' ? similarityAnimalTypeData : faceRecognitionAnimalTypeData;
  const specialPerformanceData = selectedModelType === 'similarity' ? similarityColorPerformanceData : faceRecognitionLightingPerformanceData;
  const updateHistory = selectedModelType === 'similarity' ? similarityUpdateHistory : faceRecognitionUpdateHistory;
  const specialPerformanceTitle = selectedModelType === 'similarity' ? '색상별 성능' : '조명별 성능';
  const specialPerformanceDescription =
    selectedModelType === 'similarity' ? '동물 색상별 인식 성능입니다.' : '다양한 조명 조건에서의 인식 성능입니다.';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">현재 모델 버전 정보</h1>
        <p className="text-muted-foreground">현재 배포된 AI 모델의 상세 정보를 확인합니다.</p>
      </div>

      {/* 모델 유형 선택 탭 */}
      <Tabs value={selectedModelType} onValueChange={setSelectedModelType} className="space-y-4">
        <TabsList>
          {modelTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">모델 버전</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{currentModel.version}</span>
              <Badge className="ml-2 bg-green-500">활성</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{currentModel.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">배포 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{currentModel.deployedAt.split(' ')[0]}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{currentModel.deployedAt.split(' ')[1]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">가동 시간</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{currentModel.uptime.split(' ')[0]}일</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentModel.uptime.split(' ')[1]} {currentModel.uptime.split(' ')[2]}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="performance">성능</TabsTrigger>
          <TabsTrigger value="updates">업데이트</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>모델 정보</CardTitle>
              <CardDescription>현재 배포된 모델의 기본 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">기본 정보</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">프레임워크</TableCell>
                          <TableCell>{currentModel.framework}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">아키텍처</TableCell>
                          <TableCell>{currentModel.architecture}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">입력 크기</TableCell>
                          <TableCell>{currentModel.inputSize}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">파라미터 수</TableCell>
                          <TableCell>{currentModel.parameters}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">모델 크기</TableCell>
                          <TableCell>{currentModel.size}</TableCell>
                        </TableRow>
                        {selectedModelType === 'face-recognition' && (
                          <TableRow>
                            <TableCell className="font-medium">지원 동물</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {/*{currentModel.supportedAnimals?.includes('고양이') && (*/}
                                {/*  <Badge variant="outline" className="flex items-center gap-1">*/}
                                {/*    <Cat className="h-3 w-3" /> 고양이*/}
                                {/*  </Badge>*/}
                                {/*)}*/}
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Dog className="h-3 w-3" /> 강아지
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">훈련 정보</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">훈련 데이터</TableCell>
                          <TableCell>{currentModel.trainingData}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">검증 데이터</TableCell>
                          <TableCell>{currentModel.validationData}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">개발자</TableCell>
                          <TableCell>{currentModel.author}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">저장소</TableCell>
                          <TableCell className="flex items-center">
                            <GitBranch className="mr-1 h-4 w-4 text-muted-foreground" />
                            {currentModel.repository}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">커밋</TableCell>
                          <TableCell className="flex items-center">
                            <GitCommit className="mr-1 h-4 w-4 text-muted-foreground" />
                            {currentModel.commit}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>전체 성능 지표</CardTitle>
                <CardDescription>모델의 주요 성능 지표입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, '값']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{specialPerformanceTitle}</CardTitle>
                <CardDescription>{specialPerformanceDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={specialPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {specialPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '정확도']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상세 성능 지표</CardTitle>
              <CardDescription>다양한 조건에서의 모델 성능 지표입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>카테고리</TableHead>
                    <TableHead>정확도</TableHead>
                    <TableHead>정밀도</TableHead>
                    <TableHead>재현율</TableHead>
                    <TableHead>F1 점수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">전체</TableCell>
                    <TableCell>{currentModel.accuracy * 100}%</TableCell>
                    <TableCell>{currentModel.precision * 100}%</TableCell>
                    <TableCell>{currentModel.recall * 100}%</TableCell>
                    <TableCell>{currentModel.f1Score * 100}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">고양이</TableCell>
                    <TableCell>{animalTypeData[0].정확도}%</TableCell>
                    <TableCell>{animalTypeData[0].정밀도}%</TableCell>
                    <TableCell>{animalTypeData[0].재현율}%</TableCell>
                    <TableCell>
                      {((2 * animalTypeData[0].정밀도 * animalTypeData[0].재현율) / (animalTypeData[0].정밀도 + animalTypeData[0].재현율)).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">강아지</TableCell>
                    <TableCell>{animalTypeData[1].정확도}%</TableCell>
                    <TableCell>{animalTypeData[1].정밀도}%</TableCell>
                    <TableCell>{animalTypeData[1].재현율}%</TableCell>
                    <TableCell>
                      {((2 * animalTypeData[1].정밀도 * animalTypeData[1].재현율) / (animalTypeData[1].정밀도 + animalTypeData[1].재현율)).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  {selectedModelType === 'similarity' ? (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">실내 환경</TableCell>
                        <TableCell>92%</TableCell>
                        <TableCell>95%</TableCell>
                        <TableCell>90%</TableCell>
                        <TableCell>92.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">실외 환경</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>88%</TableCell>
                        <TableCell>83%</TableCell>
                        <TableCell>85.4%</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">정면 얼굴</TableCell>
                        <TableCell>94%</TableCell>
                        <TableCell>96%</TableCell>
                        <TableCell>92%</TableCell>
                        <TableCell>94.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">측면 얼굴</TableCell>
                        <TableCell>87%</TableCell>
                        <TableCell>89%</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>87.0%</TableCell>
                      </TableRow>
                    </>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">낮은 조명</TableCell>
                    <TableCell>78%</TableCell>
                    <TableCell>82%</TableCell>
                    <TableCell>76%</TableCell>
                    <TableCell>78.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>업데이트 이력</CardTitle>
              <CardDescription>모델의 버전별 업데이트 내역입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                {updateHistory.map((update, index) => (
                  <div key={update.version} className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                      <CheckCircle2 className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                    </span>
                    <div className="flex items-center mb-1">
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                        {update.version}
                        {index === 0 && <Badge className="ml-2 bg-green-500">현재</Badge>}
                      </h3>
                      <div className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">{update.date}</div>
                    </div>
                    <ul className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 list-disc pl-5">
                      {update.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
