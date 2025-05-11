'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 샘플 데이터
const modelVersions = [
  {
    id: 'v1.3.2',
    name: '셜록냥즈 유사도 모델 v1.3.2',
    status: 'active',
    date: '2023-04-15',
    accuracy: 0.89,
    precision: 0.92,
    recall: 0.87,
    f1Score: 0.89,
  },
  {
    id: 'v1.3.1',
    name: '셜록냥즈 유사도 모델 v1.3.1',
    status: 'archived',
    date: '2023-03-22',
    accuracy: 0.86,
    precision: 0.9,
    recall: 0.84,
    f1Score: 0.87,
  },
  {
    id: 'v1.3.0',
    name: '셜록냥즈 유사도 모델 v1.3.0',
    status: 'archived',
    date: '2023-02-10',
    accuracy: 0.83,
    precision: 0.88,
    recall: 0.81,
    f1Score: 0.84,
  },
  {
    id: 'v1.2.5',
    name: '셜록냥즈 유사도 모델 v1.2.5',
    status: 'archived',
    date: '2023-01-05',
    accuracy: 0.8,
    precision: 0.85,
    recall: 0.78,
    f1Score: 0.81,
  },
];

const performanceData = [
  { name: 'v1.2.5', 정확도: 0.8, 정밀도: 0.85, 재현율: 0.78, F1점수: 0.81 },
  { name: 'v1.3.0', 정확도: 0.83, 정밀도: 0.88, 재현율: 0.81, F1점수: 0.84 },
  { name: 'v1.3.1', 정확도: 0.86, 정밀도: 0.9, 재현율: 0.84, F1점수: 0.87 },
  { name: 'v1.3.2', 정확도: 0.89, 정밀도: 0.92, 재현율: 0.87, F1점수: 0.89 },
];

export default function AIModelVersionsPage() {
  const [deployStatus, setDeployStatus] = useState<string | null>(null);

  const handleDeploy = (versionId: string) => {
    setDeployStatus('deploying');

    // 배포 시뮬레이션
    setTimeout(() => {
      setDeployStatus('success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">유사도 추출 모델 버전 관리</h1>
        <p className="text-muted-foreground">AI 모델 버전을 관리하고 성능을 모니터링합니다.</p>
      </div>

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

      <Tabs defaultValue="versions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="versions">모델 버전</TabsTrigger>
          <TabsTrigger value="performance">성능 비교</TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>모델 버전 목록</CardTitle>
              <CardDescription>실종동물 유사도 추출 모델의 모든 버전을 관리합니다.</CardDescription>
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
                    <Tooltip />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
