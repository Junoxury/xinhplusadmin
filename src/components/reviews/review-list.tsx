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

export function ReviewList() {
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    hasPhotos: false,
    hasVideos: false,
    isVerified: false,
    isBest: false,
  })

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="리뷰 내용 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="시술 분류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="face">안면</SelectItem>
                  <SelectItem value="body">체형</SelectItem>
                  <SelectItem value="skin">피부</SelectItem>
                  <SelectItem value="dental">치과</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="평점" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5점</SelectItem>
                  <SelectItem value="4">4점</SelectItem>
                  <SelectItem value="3">3점</SelectItem>
                  <SelectItem value="2">2점</SelectItem>
                  <SelectItem value="1">1점</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">공개</SelectItem>
                  <SelectItem value="hidden">비공개</SelectItem>
                  <SelectItem value="reported">신고됨</SelectItem>
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
                      <Input placeholder="병원명 검색" className="w-1/6" />
                      <Input placeholder="작성자 검색" className="w-1/6" />
                      <div className="flex items-center gap-8 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasPhotos" 
                            checked={filters.hasPhotos}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasPhotos: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasPhotos"
                            className="text-sm font-medium leading-none"
                          >
                            사진
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasVideos"
                            checked={filters.hasVideos}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasVideos: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasVideos"
                            className="text-sm font-medium leading-none"
                          >
                            동영상
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isVerified"
                            checked={filters.isVerified}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isVerified: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isVerified"
                            className="text-sm font-medium leading-none"
                          >
                            인증
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isBest"
                            checked={filters.isBest}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isBest: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isBest"
                            className="text-sm font-medium leading-none"
                          >
                            베스트
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
          총 <span className="font-medium text-primary">{10}</span>개의 리뷰
        </div>
        <Select defaultValue="date">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">최신순</SelectItem>
            <SelectItem value="rating">평점순</SelectItem>
            <SelectItem value="likes">좋아요순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>시술</TableHead>
              <TableHead>병원</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>평점</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>미디어</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작성일</TableHead>
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
          리뷰 등록
        </Button>
      </div>
    </div>
  )
} 