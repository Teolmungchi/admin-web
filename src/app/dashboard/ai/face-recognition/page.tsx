"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { CheckCircle2, Clock, Dog, Cat } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 샘플 데이터
const modelVersions = [
  {
    id: "v2.1.0",
    name: "반려동물 얼굴인식 모델 v2.1.0",
    status: "active",
    date: "2023-05-10",
    accuracy: 0.91,
    precision: 0.93,
    recall: 0.89,
    f1Score: 0.91,
    supportedAnimals: ["고양이", "강아지"],
  },
  {
    id: "v2.0.2",
    name: "반려동물 얼굴인식 모델 v2.0.2",
    status: "archived",
    date: "2023-04-05",
    accuracy: 0.88,
    precision: 0.91,
    recall: 0.86,
    f1Score: 0.88,
    supportedAnimals: ["고양이", "강아지"],
  },
  {
    id: "v2.0.1",
    name: "반려동물 얼굴인식 모델 v2.0.1",
    status: "archived",
    date: "2023-03-12",
    accuracy: 0.85,
    precision: 0.89,
    recall: 0.83,
    f1Score: 0.86,
    supportedAnimals: ["고양이", "강아지"],
  },
  {
    id: "v1.5.0",
    name: "반려동물 얼굴인식 모델 v1.5.0",
    status: "archived",
    date: "2023-02-01",
    accuracy: 0.82,
    precision: 0.86,
    recall: 0.8,
    f1Score: 0.83,
    supportedAnimals: ["고양이"],
  },
]

const performanceData = [
  { name: "v1.5.0", 정확도: 0.82, 정밀도: 0.86, 재현율: 0.8, F1점수: 0.83 },
  { name: "v2.0.1", 정확도: 0.85, 정밀도: 0.89, 재현율: 0.83, F1점수: 0.86 },
  { name: "v2.0.2", 정확도: 0.88, 정밀도: 0.91, 재현율: 0.86, F1점수: 0.88 },
  { name: "v2.1.0", 정확도: 0.91, 정밀도: 0.93, 재현율: 0.89, F1점수: 0.91 },
]

const animalPerformanceData = [
  { name: "고양이", 정확도: 0.93, 정밀도: 0.95, 재현율: 0.91 },
  { name: "강아지", 정확도: 0.89, 정밀도: 0.91, 재현율: 0.87 },
]

const lightingPerformanceData = [
  { name: "밝은 조명", 정확도: 0.94 },
  { name: "보통 조명", 정확도: 0.91 },
  { name: "어두운 조명", 정확도: 0.83 },
  { name: "야외 자연광", 정확도: 0.88 },
]

export default function FaceRecognitionModelPage() {
  const [deployStatus, setDeployStatus] = useState<string | null>(null)

  const handleDeploy = (versionId: string) => {
    setDeployStatus("deploying")

    // 배포 시뮬레이션
    setTimeout(() => {
      setDeployStatus("success")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">얼굴인식 모델 관리</h1>
        <p className="text-muted-foreground">반려동물 얼굴인식 AI 모델 버전을 관리하고 성능을 모니터링합니다.</p>
      </div>

      {deployStatus === "deploying" && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>모델 배포 중</AlertTitle>
          <AlertDescription>
            선택한 모델 버전을 배포하고 있습니다. 이 작업은 몇 분 정도 소요될 수 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {deployStatus === "success" && (
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
          <TabsTrigger value="animals">동물별 성능</TabsTrigger>
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
                        {version.status === "active" ? (
                          <Badge className="bg-green-500">활성</Badge>
                        ) : (
                          <Badge variant="outline">보관</Badge>
                        )}
                      </TableCell>
                      <TableCell>{version.date}</TableCell>
                      <TableCell>{(version.accuracy * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {version.supportedAnimals.includes("고양이") && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Cat className="h-3 w-3" /> 고양이
                            </Badge>
                          )}
                          {version.supportedAnimals.includes("강아지") && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Dog className="h-3 w-3" /> 강아지
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {version.status === "active" ? (
                          <Button variant="outline" size="sm" disabled>
                            현재 활성
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeploy(version.id)}
                            disabled={deployStatus === "deploying"}
                          >
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
                    <Tooltip formatter={(value) => [(value as number).toFixed(2), ""]} />
                    <Line type="monotone" dataKey="정확도" stroke="#8884d8" />
                    <Line type="monotone" dataKey="정밀도" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="재현율" stroke="#ffc658" />
                    <Line type="monotone" dataKey="F1점수" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                각 버전별 성능 지표를 비교하여 모델의 개선 추이를 확인할 수 있습니다.
              </p>
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
                    <Tooltip formatter={(value) => [(value as number).toFixed(2), "정확도"]} />
                    <Bar dataKey="정확도" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                현재 활성화된 모델(v2.1.0)의 다양한 조명 조건에서의 성능입니다.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="animals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>동물별 성능 비교</CardTitle>
              <CardDescription>동물 종류별 얼굴인식 성능을 비교합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={animalPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0.7, 1]} />
                    <Tooltip formatter={(value) => [(value as number).toFixed(2), ""]} />
                    <Bar dataKey="정확도" fill="#8884d8" />
                    <Bar dataKey="정밀도" fill="#82ca9d" />
                    <Bar dataKey="재현율" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">현재 활성화된 모델(v2.1.0)의 동물 종류별 성능 비교입니다.</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>동물별 상세 성능 지표</CardTitle>
              <CardDescription>동물 종류별 얼굴인식 상세 성능 지표입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>동물 종류</TableHead>
                    <TableHead>정확도</TableHead>
                    <TableHead>정밀도</TableHead>
                    <TableHead>재현율</TableHead>
                    <TableHead>F1 점수</TableHead>
                    <TableHead>샘플 수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">고양이</TableCell>
                    <TableCell>93%</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>93%</TableCell>
                    <TableCell>8,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">강아지</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>87%</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>7,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">고양이 (짧은 털)</TableCell>
                    <TableCell>94%</TableCell>
                    <TableCell>96%</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>94%</TableCell>
                    <TableCell>5,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">고양이 (긴 털)</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>93%</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>3,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">강아지 (소형)</TableCell>
                    <TableCell>90%</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>88%</TableCell>
                    <TableCell>90%</TableCell>
                    <TableCell>2,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">강아지 (중형)</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>87%</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>2,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">강아지 (대형)</TableCell>
                    <TableCell>87%</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>85%</TableCell>
                    <TableCell>87%</TableCell>
                    <TableCell>1,900</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
