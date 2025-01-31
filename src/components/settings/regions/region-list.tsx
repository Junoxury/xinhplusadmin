'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

export function RegionList() {
  const [pageSize, setPageSize] = useState('10')

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input placeholder="지역명 검색" className="w-1/3" />
          <Select className="w-1/3">
            <SelectTrigger>
              <SelectValue placeholder="상위 지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">서울</SelectItem>
              <SelectItem value="gyeonggi">경기</SelectItem>
              <SelectItem value="incheon">인천</SelectItem>
            </SelectContent>
          </Select>
          <Select className="w-1/3">
            <SelectTrigger>
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 테이블 헤더와 정렬 옵션 */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          총 <span className="font-medium text-primary">{10}</span>개의 지역
        </div>
        <Select defaultValue="order">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">노출 순서</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="hospitals">병원수</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>지역명</TableHead>
              <TableHead>상위지역</TableHead>
              <TableHead>깊이</TableHead>
              <TableHead>병원수</TableHead>
              <TableHead>위도</TableHead>
              <TableHead>경도</TableHead>
              <TableHead>순서</TableHead>
              <TableHead>상태</TableHead>
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
          지역 등록
        </Button>
      </div>
    </div>
  )
} 