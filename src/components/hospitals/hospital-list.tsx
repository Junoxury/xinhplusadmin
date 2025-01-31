'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"

export function HospitalList() {
  const [pageSize, setPageSize] = useState('10')
  const [selectedDepth2, setSelectedDepth2] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    isAd: false,
    isRecommended: false,
    isMember: false,
    hasGoogleMap: false,
  })

  // 임시 카테고리 데이터
  const depth2Categories = [
    { id: 'face', name: '안면' },
    { id: 'body', name: '체형' },
    { id: 'skin', name: '피부' },
  ]

  const depth3Categories = {
    face: [
      { id: 'nose', name: '코 성형' },
      { id: 'eyes', name: '눈 성형' },
      { id: 'lifting', name: '리프팅' },
    ],
    body: [
      { id: 'lipo', name: '지방흡입' },
      { id: 'breast', name: '가슴 성형' },
    ],
    skin: [
      { id: 'laser', name: '레이저' },
      { id: 'botox', name: '보톡스' },
    ],
  }

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="병원명 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                className="w-1/3"
                value={selectedDepth2}
                onValueChange={setSelectedDepth2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리(대분류)" />
                </SelectTrigger>
                <SelectContent>
                  {depth2Categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select className="w-1/3" disabled={!selectedDepth2}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리(소분류)" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepth2 && depth3Categories[selectedDepth2 as keyof typeof depth3Categories].map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-8 h-6 bg-card hover:bg-card/80 border border-border"
                  >
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full">
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <Input placeholder="이메일 검색" className="w-1/6" />
                      <Input placeholder="전화번호 검색" className="w-1/6" />
                      <div className="flex items-center gap-8 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isAd" 
                            checked={filters.isAd}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isAd: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isAd"
                            className="text-sm font-medium leading-none"
                          >
                            광고
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isRecommended"
                            checked={filters.isRecommended}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isRecommended: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isRecommended"
                            className="text-sm font-medium leading-none"
                          >
                            추천
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isMember"
                            checked={filters.isMember}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isMember: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isMember"
                            className="text-sm font-medium leading-none"
                          >
                            멤버
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasGoogleMap"
                            checked={filters.hasGoogleMap}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasGoogleMap: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasGoogleMap"
                            className="text-sm font-medium leading-none"
                          >
                            구글
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </Card>

      {/* 테이블 헤더와 정렬 옵션 */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          총 <span className="font-medium text-primary">{10}</span>개의 병원
        </div>
        <Select defaultValue="name">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">병원명 순</SelectItem>
            <SelectItem value="date">가입일자 순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>썸네일</TableHead>
              <TableHead>병원명</TableHead>
              <TableHead>도시</TableHead>
              <TableHead>소개</TableHead>
              <TableHead>광고</TableHead>
              <TableHead>추천</TableHead>
              <TableHead>멤버</TableHead>
              <TableHead>웹사이트</TableHead>
              <TableHead>구글맵</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 샘플 데이터 */}
            {[
              {
                id: 1,
                name: "서울성형외과",
                city: "서울",
                description: "20년 전통의 성형외과 전문병원입니다. 코성형, 안면윤곽 전문",
                isAd: true,
                isRecommended: true,
                members: 128,
              },
              {
                id: 2,
                name: "강남미소치과",
                city: "서울",
                description: "치아교정 및 임플란트 전문 치과입니다. 야간진료 가능",
                isAd: true,
                isRecommended: false,
                members: 85,
              },
              {
                id: 3,
                name: "부산라인성형외과",
                city: "부산",
                description: "부산 서면 20년 노하우 성형외과입니다. 가슴성형 전문",
                isAd: false,
                isRecommended: true,
                members: 92,
              },
              {
                id: 4,
                name: "대구예쁨성형외과",
                city: "대구",
                description: "대구 동성로 미용성형 전문병원입니다. 쌍꺼풀, 코성형 전문",
                isAd: true,
                isRecommended: false,
                members: 64,
              },
              {
                id: 5,
                name: "인천탑치과",
                city: "인천",
                description: "인천 부평 치아교정 전문 치과입니다. 교정 전문의 진료",
                isAd: false,
                isRecommended: true,
                members: 73,
              },
              {
                id: 6,
                name: "광주미인성형외과",
                city: "광주",
                description: "광주 충장로 성형외과입니다. 눈성형, 안면윤곽 전문",
                isAd: true,
                isRecommended: true,
                members: 45,
              },
              {
                id: 7,
                name: "대전365치과",
                city: "대전",
                description: "연중무휴 진료 가능한 치과입니다. 임플란트 전문",
                isAd: false,
                isRecommended: false,
                members: 38,
              },
              {
                id: 8,
                name: "울산라인성형외과",
                city: "울산",
                description: "울산 남구 성형외과입니다. 리프팅, 지방흡입 전문",
                isAd: true,
                isRecommended: false,
                members: 51,
              },
              {
                id: 9,
                name: "제주예쁨치과",
                city: "제주",
                description: "제주시 미용치과입니다. 치아미백, 교정 전문",
                isAd: false,
                isRecommended: true,
                members: 29,
              },
              {
                id: 10,
                name: "분당성형외과",
                city: "성남",
                description: "분당구 성형외과입니다. 눈성형, 코성형 전문",
                isAd: true,
                isRecommended: true,
                members: 82,
              },
            ].map((hospital) => (
              <TableRow key={hospital.id}>
                <TableCell>{hospital.id}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 bg-background-tertiary rounded" />
                </TableCell>
                <TableCell>{hospital.name}</TableCell>
                <TableCell>{hospital.city}</TableCell>
                <TableCell className="max-w-xs truncate">{hospital.description}</TableCell>
                <TableCell>{hospital.isAd ? "Y" : "N"}</TableCell>
                <TableCell>{hospital.isRecommended ? "Y" : "N"}</TableCell>
                <TableCell>{hospital.members}</TableCell>
                <TableCell>
                  <Button variant="link" size="sm">방문</Button>
                </TableCell>
                <TableCell>
                  <Button variant="link" size="sm">지도</Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">편집</Button>
                    <Button variant="destructive" size="sm">삭제</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션과 등록 버튼 */}
      <div className="flex items-center justify-between">
        <Select value={pageSize} onValueChange={setPageSize}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="페이지당 항목 수" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">처음</Button>
            <Button variant="outline" size="sm">이전</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">5</Button>
            <Button variant="outline" size="sm">6</Button>
            <Button variant="outline" size="sm">7</Button>
            <Button variant="outline" size="sm">8</Button>
            <Button variant="outline" size="sm">9</Button>
            <Button variant="outline" size="sm">10</Button>
            <Button variant="outline" size="sm">다음</Button>
            <Button variant="outline" size="sm">마지막</Button>
          </div>
        </div>

        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          병원 등록
        </Button>
      </div>
    </div>
  )
} 