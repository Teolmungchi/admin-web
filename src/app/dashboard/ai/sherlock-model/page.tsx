'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AIModelVersionsPage() {
  const [modelVersions, setModelVersions] = useState([]);
  const [deployStatus, setDeployStatus] = useState(null);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [versionsRes] = await Promise.all([
          fetch('http://localhost:8000/sherlock/model-versions'),
        ]);

        if (!versionsRes.ok) throw new Error('모델 버전 데이터를 가져오는데 실패했습니다.');

        const versionsData = await versionsRes.json();

        setModelVersions(versionsData.model_versions);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // 모델 배포
  const handleDeploy = async (versionId) => {
    setDeployStatus('deploying');
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/sherlock/deploy-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version_id: versionId }),
      });

      if (!response.ok) throw new Error('모델 배포에 실패했습니다.');

      // 모델 목록 새로고침
      const versionsRes = await fetch('http://localhost:8000/sherlock/model-versions');
      if (!versionsRes.ok) throw new Error('모델 버전 데이터를 가져오는데 실패했습니다.');
      const versionsData = await versionsRes.json();
      setModelVersions(versionsData.model_versions);

      setDeployStatus('success');
    } catch (err) {
      setDeployStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">유사도 추출 모델 버전 관리</h1>
        <p className="text-muted-foreground">AI 모델 버전을 관리하고 성능을 모니터링합니다.</p>
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
    </div>
  );
}
