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

export function KoreaVisitList() {
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    isConfirmed: false,
    hasPassport: false,
    hasVisa: false,
    isCompleted: false,
    status: 'all',
  })

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="고객명 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <div className="w-1/3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="방문 목적" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgery">수술</SelectItem>
                    <SelectItem value="treatment">시술</SelectItem>
                    <SelectItem value="consultation">상담</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="방문 단계" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">신청</SelectItem>
                    <SelectItem value="preparation">준비중</SelectItem>
                    <SelectItem value="confirmed">확정</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/3">
                <Select 
                  value={filters.status}
                  onValueChange={(value: typeof filters.status) => 
                    setFilters(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="ad">광고</SelectItem>
                    <SelectItem value="recommended">추천</SelectItem>
                    <SelectItem value="member">멤버</SelectItem>
                    <SelectItem value="google">구글</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                      <Input placeholder="병원명 검색" className="w-1/6" />
                      <Input placeholder="담당자 검색" className="w-1/6" />
                      <div className="flex items-center gap-8 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isConfirmed" 
                            checked={filters.isConfirmed}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isConfirmed: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isConfirmed"
                            className="text-sm font-medium leading-none"
                          >
                            확정
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasPassport"
                            checked={filters.hasPassport}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasPassport: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasPassport"
                            className="text-sm font-medium leading-none"
                          >
                            여권
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasVisa"
                            checked={filters.hasVisa}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasVisa: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasVisa"
                            className="text-sm font-medium leading-none"
                          >
                            비자
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isCompleted"
                            checked={filters.isCompleted}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isCompleted: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isCompleted"
                            className="text-sm font-medium leading-none"
                          >
                            완료
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
          총 <span className="font-medium text-primary">{10}</span>건의 원정
        </div>
        <Select defaultValue="date">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">신청일순</SelectItem>
            <SelectItem value="visit">방문일순</SelectItem>
            <SelectItem value="status">상태순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>고객명</TableHead>
              <TableHead>방문목적</TableHead>
              <TableHead>방문병원</TableHead>
              <TableHead>방문일정</TableHead>
              <TableHead>여권</TableHead>
              <TableHead>비자</TableHead>
              <TableHead>단계</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 샘플 데이터는 나중에 추가하겠습니다 */}
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
            <Button variant="outline" size="sm">다음</Button>
            <Button variant="outline" size="sm">마지막</Button>
          </div>
        </div>

        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          원정 등록
        </Button>
      </div>
    </div>
  )
} 