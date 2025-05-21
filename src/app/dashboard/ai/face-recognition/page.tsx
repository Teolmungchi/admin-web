'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Cat, CheckCircle2, Clock, Dog } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FaceRecognitionModelPage() {
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [animalPerformanceData, setAnimalPerformanceData] = useState([]);
  const [lightingPerformanceData, setLightingPerformanceData] = useState([]);
  const [deployStatus, setDeployStatus] = useState<null | "deploying" | "success" | "error">(null);
  const [error, setError] = useState<null | string>(null);

  interface ModelVersion {
    id: number;
    name: string;
    status: string;
    date: string;
    accuracy: number;
    supportedAnimals: string[];
  }


  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [versionsRes, perfRes, animalRes, lightingRes] = await Promise.all([
          fetch('https://khyu2.store/face-recognition/model-versions', { cache: 'no-store' }),
          fetch('https://khyu2.store/face-recognition/performance', { cache: 'no-store' }),
          fetch('https://khyu2.store/face-recognition/animal-performance', { cache: 'no-store' }),
          fetch('https://khyu2.store/face-recognition/lighting-performance', { cache: 'no-store' }),
        ]);

        if (!versionsRes.ok) throw new Error('모델 버전 데이터를 가져오는데 실패했습니다.');
        if (!perfRes.ok) throw new Error('성능 데이터를 가져오는데 실패했습니다.');
        if (!animalRes.ok) throw new Error('동물별 성능 데이터를 가져오는데 실패했습니다.');
        if (!lightingRes.ok) throw new Error('조명 조건별 성능 데이터를 가져오는데 실패했습니다.');

        const versionsData = await versionsRes.json();
        const perfData = await perfRes.json();
        const animalData = await animalRes.json();
        const lightingData = await lightingRes.json();

        setModelVersions(versionsData.model_versions);
        setPerformanceData(perfData.performance_data);
        setAnimalPerformanceData(animalData.animal_performance_data);
        setLightingPerformanceData(lightingData.lighting_performance_data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };
    fetchData();
  }, []);

  // 모델 배포
  const handleDeploy = async (versionId : number) => {
    setDeployStatus('deploying');
    setError(null);
    try {
      const response = await fetch('https://khyu2.store/face-recognition/deploy-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version_id: versionId }),
      });

      if (!response.ok) throw new Error('모델 배포에 실패했습니다.');

      // 모델 목록 새로고침
      const versionsRes = await fetch('https://khyu2.store/face-recognition/model-versions');
      if (!versionsRes.ok) throw new Error('모델 버전 데이터를 가져오는데 실패했습니다.');
      const versionsData = await versionsRes.json();
      setModelVersions(versionsData.model_versions);

      setDeployStatus('success');
    } catch (err) {
      setDeployStatus('error');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">얼굴인식 모델 관리</h1>
        <p className="text-muted-foreground">반려동물 얼굴인식 AI 모델 버전을 관리하고 성능을 모니터링합니다.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {deployStatus === 'deploying' && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>모델 배포 중</AlertTitle>
          <AlertDescription>선택한 모델 버전을 배포하고 있습니다. 이 작업은 몇 분 정도 소요될 수 있습니다.</AlertDescription>
        </Alert>
      )}

      {deployStatus === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>배포 완료</AlertTitle>
          <AlertDescription>모델 버전이 성공적으로 배포되었습니다. 새 모델이 활성화되었습니다.</AlertDescription>
        </Alert>
      )}

      {deployStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>배포 실패</AlertTitle>
          <AlertDescription>모델 배포 중 오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="versions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="versions">모델 버전</TabsTrigger>
          <TabsTrigger value="performance">성능 비교</TabsTrigger>
          {/*<TabsTrigger value="animals">동물별 성능</TabsTrigger>*/}
        </TabsList>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>모델 버전 목록</CardTitle>
              <CardDescription>반려동물 얼굴인식 모델의 모든 버전을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>버전</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>배포일</TableHead>
                    <TableHead>정확도</TableHead>
                    <TableHead>지원 동물</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelVersions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">{version.id}</TableCell>
                      <TableCell>{version.name}</TableCell>
                      <TableCell>
                        {version.status === 'active' ? <Badge className="bg-green-500">활성</Badge> : <Badge variant="outline">보관</Badge>}
                      </TableCell>
                      <TableCell>{version.date}</TableCell>
                      <TableCell>{(version.accuracy * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {version.supportedAnimals.includes('고양이') && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Cat className="h-3 w-3" /> 고양이
                            </Badge>
                          )}
                          {version.supportedAnimals.includes('강아지') && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Dog className="h-3 w-3" /> 강아지
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {version.status === 'active' ? (
                          <Button variant="outline" size="sm" disabled>
                            현재 활성
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleDeploy(version.id)} disabled={deployStatus === 'deploying'}>
                            배포
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>모델 성능 비교</CardTitle>
              <CardDescription>각 모델 버전의 성능 지표를 비교합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0.7, 1]} />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === 'number'
                          ? value.toFixed(2)
                          : Number(value).toFixed(2),
                        '',
                      ]}
                    />

                    <Line type="monotone" dataKey="정확도" stroke="#8884d8" />
                    <Line type="monotone" dataKey="정밀도" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="재현율" stroke="#ffc658" />
                    <Line type="monotone" dataKey="F1점수" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">각 버전별 성능 지표를 비교하여 모델의 개선 추이를 확인할 수 있습니다.</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>조명 조건별 성능</CardTitle>
              <CardDescription>다양한 조명 조건에서의 모델 성능을 비교합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lightingPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0.7, 1]} />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === 'number'
                          ? value.toFixed(2)
                          : Number(value).toFixed(2),
                        '정확도'
                      ]}
                    />
                    <Bar dataKey="정확도" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">현재 활성화된 모델의 다양한 조명 조건에서의 성능입니다.</p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/*<TabsContent value="animals" className="space-y-4">*/}
        {/*  <Card>*/}
        {/*    <CardHeader>*/}
        {/*      <CardTitle>동물별 성능 비교</CardTitle>*/}
        {/*      <CardDescription>동물 종류별 얼굴인식 성능을 비교합니다.</CardDescription>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <div className="h-[400px]">*/}
        {/*        <ResponsiveContainer width="100%" height="100%">*/}
        {/*          <BarChart data={animalPerformanceData}>*/}
        {/*            <CartesianGrid strokeDasharray="3 3" />*/}
        {/*            <XAxis dataKey="name" />*/}
        {/*            <YAxis domain={[0.7, 1]} />*/}
        {/*            <Tooltip formatter={(value) => [value.toFixed(2), '']} />*/}
        {/*            <Bar dataKey="정확도" fill="#8884d8" />*/}
        {/*            <Bar dataKey="정밀도" fill="#82ca9d" />*/}
        {/*            <Bar dataKey="재현율" fill="#ffc658" />*/}
        {/*          </BarChart>*/}
        {/*        </ResponsiveContainer>*/}
        {/*      </div>*/}
        {/*    </CardContent>*/}
        {/*    <CardFooter>*/}
        {/*      <p className="text-sm text-muted-foreground">현재 활성화된 모델의 동물 종류별 성능 비교입니다.</p>*/}
        {/*    </CardFooter>*/}
        {/*  </Card>*/}
        {/*</TabsContent>*/}
      </Tabs>
    </div>
  );
}
