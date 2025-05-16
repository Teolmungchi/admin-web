'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Dog, GitBranch, GitCommit, Package } from 'lucide-react';

// 모델 선택 탭
const modelTypes = [
  { value: 'similarity', label: '유사도 추출 모델' },
  // { value: 'face-recognition', label: '얼굴인식 모델' },
];

// 차트 색상
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

export default function CurrentVersionPage() {
  const [selectedModelType, setSelectedModelType] = useState('similarity');
  const [currentModel, setCurrentModel] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [animalTypeData, setAnimalTypeData] = useState([]);
  const [specialPerformanceData, setSpecialPerformanceData] = useState([]);
  const [updateHistory, setUpdateHistory] = useState([]);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/current-version/${selectedModelType}`);
        if (!response.ok) throw new Error('모델 데이터를 가져오는데 실패했습니다.');
        const data = await response.json();
        setCurrentModel(data);
        setPerformanceData(data.performanceData);
        setAnimalTypeData(data.animalTypeData);
        setSpecialPerformanceData(data.colorPerformanceData || data.lightingPerformanceData);
        setUpdateHistory(data.updateHistory);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchModelData();
  }, [selectedModelType]);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">오류</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!currentModel) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">로딩 중...</h1>
      </div>
    );
  }

  const specialPerformanceTitle = selectedModelType === 'similarity' ? '색상별 성능' : '조명별 성능';
  const specialPerformanceDescription =
    selectedModelType === 'similarity' ? '동물 색상별 인식 성능입니다.' : '다양한 조명 조건에서의 인식 성능입니다.';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">현재 모델 버전 정보</h1>
        <p className="text-muted-foreground">현재 배포된 AI 모델의 상세 정보를 확인합니다.</p>
      </div>

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
              <span className="text-2xl font-bold">{currentModel.uptime.split(' ')[0]}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentModel.uptime.split(' ')[1]} {currentModel.uptime.split(' ')[2]}
            </p>
          </CardContent>
        </Card>
      </div>

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
                            {currentModel.supportedAnimals?.includes('고양이') && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Dog className="h-3 w-3" /> 고양이
                              </Badge>
                            )}
                            {currentModel.supportedAnimals?.includes('강아지') && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Dog className="h-3 w-3" /> 강아지
                              </Badge>
                            )}
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
    </div>
  );
}
