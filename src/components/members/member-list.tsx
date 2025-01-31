'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMembersList, type Member } from '@/services/members'
import { getRegions } from '@/services/regions'
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
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Mail, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function MemberList() {
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    gender: 'all',
    provider: 'all',
    city: null as number | null,
    category: null as number | null,
    hasReviews: false,
    isActive: false,
  })

  // 회원 목록 조회
  const { data: memberData, isLoading, error } = useQuery({
    queryKey: ['members', currentPage, pageSize, searchText, filters],
    queryFn: async () => {
      console.log('Fetching members with params:', {
        search_text: searchText || undefined,
        gender_filter: filters.gender || undefined,
        provider_filter: filters.provider || undefined,
        city_filter: filters.city || undefined,
        category_filter: filters.category || undefined,
        page_number: currentPage,
        items_per_page: Number(pageSize)
      });

      const result = await getMembersList({
        search_text: searchText || undefined,
        gender_filter: filters.gender || undefined,
        provider_filter: filters.provider || undefined,
        city_filter: filters.city || undefined,
        category_filter: filters.category || undefined,
        page_number: currentPage,
        items_per_page: Number(pageSize)
      });

      console.log('API Response:', result);
      return result;
    }
  })

  // 지역 목록 조회
  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const result = await getRegions();
      console.log('Regions data:', result);
      return result;
    }
  })

  // 에러 처리 추가
  if (error) {
    console.error('Error fetching members:', error);
    return <div>에러가 발생했습니다: {(error as Error).message}</div>;
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil((memberData?.total_count || 0) / Number(pageSize))
  const pageNumbers = Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="이메일, 닉네임 검색" 
              className="w-1/3"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="flex gap-2 w-2/3">
              <Select 
                value={filters.gender}
                onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="성별" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.provider}
                onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}
                className="w-1/3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="가입 경로" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="google">구글</SelectItem>
                  <SelectItem value="facebook">페이스북</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.city?.toString()}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    city: value === 'all' ? null : Number(value) 
                  }))
                }
                className="w-1/3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="관심지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {regions?.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
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
                      <Input placeholder="전화번호 검색" className="w-1/6" />
                      <Select className="w-1/6">
                        <SelectTrigger>
                          <SelectValue placeholder="관심카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="plastic">성형외과</SelectItem>
                          <SelectItem value="dermatology">피부과</SelectItem>
                          <SelectItem value="dental">치과</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-8 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hasReviews"
                            checked={filters.hasReviews}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({...prev, hasReviews: checked as boolean}))
                            }
                          />
                          <label
                            htmlFor="hasReviews"
                            className="text-sm font-medium leading-none"
                          >
                            리뷰
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
          총 <span className="font-medium text-primary">{memberData?.total_count || 0}</span>명의 회원
        </div>
        <Select defaultValue="latest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="login">접속순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">번호</TableHead>
              <TableHead className="w-[80px]">이미지</TableHead>
              <TableHead className="w-[200px]">이메일</TableHead>
              <TableHead className="w-[120px]">닉네임</TableHead>
              <TableHead className="w-[50px]">성별</TableHead>
              <TableHead className="w-[140px]">전화번호</TableHead>
              <TableHead className="w-[100px]">가입경로</TableHead>
              <TableHead className="w-[160px]">최근접속</TableHead>
              <TableHead className="w-[200px]">관심도시</TableHead>
              <TableHead className="w-[120px]">관심카테고리</TableHead>
              <TableHead className="w-[60px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  로딩중...
                </TableCell>
              </TableRow>
            ) : memberData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  회원이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              memberData?.data.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {(currentPage - 1) * Number(pageSize) + index + 1}
                  </TableCell>
                  <TableCell>
                    {member.avatar_url && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                        <img 
                          src={member.avatar_url} 
                          alt={member.nickname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.email}</TableCell>
                  <TableCell>{member.nickname}</TableCell>
                  <TableCell>
                    {member.gender && (
                      <Badge variant="outline">
                        {member.gender === 'male' ? '남성' : '여성'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.provider}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(member.last_sign_in_at).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {member.city_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="link" className="p-0 h-auto font-normal">
                          상세보기
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto">
                        <div className="flex flex-wrap gap-1">
                          {member.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>상세보기</DropdownMenuItem>
                        <DropdownMenuItem>수정하기</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          삭제하기
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              처음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              마지막
            </Button>
          </div>
        </div>

        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          회원 등록
        </Button>
      </div>
    </div>
  )
} 