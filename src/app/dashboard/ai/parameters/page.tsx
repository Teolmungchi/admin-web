'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, History, Save } from 'lucide-react';

export default function AIParametersPage() {
  const [currentParams, setCurrentParams] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  // 초기 파라미터 조회
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch('http://localhost:8000/parameters/');
        if (!response.ok) throw new Error('파라미터 조회 실패');
        const data = await response.json();
        setCurrentParams(data);
      } catch (err) {
        setErrorMessage('파라미터를 불러오지 못했습니다: ' + err.message);
      }
    };
    fetchParameters();
  }, []);

  // 저장 처리
  const handleSave = async () => {
    setSaveStatus('saving');
    setIsSaveDialogOpen(true);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:8000/parameters/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentParams),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '파라미터 저장 실패');
      }
      const result = await response.json();
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage('저장 실패: ' + err.message);
    }
  };

  // 초기화 처리
  const handleReset = async () => {
    try {
      const response = await fetch('http://localhost:8000/parameters/');
      if (!response.ok) throw new Error('기본 파라미터 조회 실패');
      const data = await response.json();
      setCurrentParams(data);
      setIsResetDialogOpen(false);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('기본 파라미터를 불러오지 못했습니다: ' + err.message);
    }
  };

  // 매칭 파라미터 업데이트
  const updateMatchingParam = (key, value) => {
    setCurrentParams({
      ...currentParams,
      matching: {
        ...currentParams.matching,
        [key]: value,
      },
    });
  };

  // 특징 가중치 업데이트
  const updateFeatureWeight = (key, value) => {
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

  // 로딩 상태
  if (!currentParams) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">설정/파라미터 관리</h1>
          <p className="text-muted-foreground">AI 모델의 설정과 파라미터를 관리합니다.</p>
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

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

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
              onChange={(e) => updateMatchingParam('maxSuggestions', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">매칭 결과로 표시할 최대 항목 수</p>
          </div>
        </CardContent>
      </Card>

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

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>설정 저장</DialogTitle>
            <DialogDescription>
              {saveStatus === 'saving'
                ? '설정을 저장하고 있습니다...'
                : saveStatus === 'success'
                  ? '설정이 성공적으로 저장되었습니다.'
                  : '설정 저장에 실패했습니다.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {saveStatus === 'saving' ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : saveStatus === 'success' ? (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>저장 완료</AlertTitle>
                <AlertDescription>모든 설정이 성공적으로 저장되었습니다. 변경사항은 즉시 적용됩니다.</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{errorMessage || '설정 저장에 실패했습니다.'}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsSaveDialogOpen(false)}
              disabled={saveStatus === 'saving'}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}