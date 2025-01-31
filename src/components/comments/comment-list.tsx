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

export function CommentList() {
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    hasReplies: false,
    isReported: false,
    isPinned: false,
    isActive: false,
  })

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="댓글 내용 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="댓글 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">일반</SelectItem>
                  <SelectItem value="reply">답글</SelectItem>
                  <SelectItem value="mention">멘션</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="게시 위치" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">리뷰</SelectItem>
                  <SelectItem value="community">커뮤니티</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                  <SelectItem value="deleted">삭제됨</SelectItem>
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
                      <Input placeholder="작성자 검색" className="w-1/6" />
                      <Input placeholder="IP 검색" className="w-1/6" />
                      <div className="flex items-center gap-8 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasReplies" 
                            checked={filters.hasReplies}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasReplies: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasReplies"
                            className="text-sm font-medium leading-none"
                          >
                            답글있음
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isReported"
                            checked={filters.isReported}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isReported: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isReported"
                            className="text-sm font-medium leading-none"
                          >
                            신고됨
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isPinned"
                            checked={filters.isPinned}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isPinned: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isPinned"
                            className="text-sm font-medium leading-none"
                          >
                            고정됨
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isActive"
                            checked={filters.isActive}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isActive: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isActive"
                            className="text-sm font-medium leading-none"
                          >
                            활성
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
          총 <span className="font-medium text-primary">{10}</span>개의 댓글
        </div>
        <Select defaultValue="date">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">최신순</SelectItem>
            <SelectItem value="likes">좋아요순</SelectItem>
            <SelectItem value="replies">답글순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>게시위치</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>답글</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>신고</TableHead>
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
          댓글 등록
        </Button>
      </div>
    </div>
  )
} 