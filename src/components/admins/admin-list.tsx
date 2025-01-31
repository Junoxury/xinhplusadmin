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

export function AdminList() {
  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    isActive: false,
    isSuperAdmin: false,
    hasPermission: false,
    isLoggedIn: false,
  })

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="관리자명 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="권한 등급" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super">슈퍼관리자</SelectItem>
                  <SelectItem value="admin">일반관리자</SelectItem>
                  <SelectItem value="manager">매니저</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operation">운영팀</SelectItem>
                  <SelectItem value="support">고객지원팀</SelectItem>
                  <SelectItem value="marketing">마케팅팀</SelectItem>
                </SelectContent>
              </Select>
              <Select className="w-1/3">
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  <SelectItem value="suspended">정지</SelectItem>
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
                      <Input placeholder="연락처 검색" className="w-1/6" />
                      <div className="flex items-center gap-8 ml-4">
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
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isSuperAdmin"
                            checked={filters.isSuperAdmin}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isSuperAdmin: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isSuperAdmin"
                            className="text-sm font-medium leading-none"
                          >
                            슈퍼관리자
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasPermission"
                            checked={filters.hasPermission}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasPermission: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasPermission"
                            className="text-sm font-medium leading-none"
                          >
                            권한있음
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isLoggedIn"
                            checked={filters.isLoggedIn}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, isLoggedIn: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="isLoggedIn"
                            className="text-sm font-medium leading-none"
                          >
                            로그인중
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
          총 <span className="font-medium text-primary">{10}</span>명의 관리자
        </div>
        <Select defaultValue="name">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="grade">등급순</SelectItem>
            <SelectItem value="login">최근접속순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>권한등급</TableHead>
              <TableHead>부서</TableHead>
              <TableHead>최근접속</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>등록일</TableHead>
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
            <SelectItem value="10">10명씩 보기</SelectItem>
            <SelectItem value="20">20명씩 보기</SelectItem>
            <SelectItem value="50">50명씩 보기</SelectItem>
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
          관리자 등록
        </Button>
      </div>
    </div>
  )
} 