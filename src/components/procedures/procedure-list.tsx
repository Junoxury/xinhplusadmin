'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CategoryService } from '@/services/categories'
import { RegionService } from '@/services/regions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Slider } from '@/components/ui/slider'
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
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getTreatments, type Treatment } from '@/services/treatments'

export function ProcedureList() {
  // 가격 범위 최대값 설정 (99,999,999 VND)
  const MAX_PRICE = 99999999;

  const [pageSize, setPageSize] = useState('10')
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE])
  const [filters, setFilters] = useState({
    depth2Category: null as string | null,
    depth3Category: null as string | null,
    city: null as string | null,
    status: [] as string[],
    // 초기 가격 범위를 priceRange와 동일하게 설정
    priceFrom: '0',
    priceTo: MAX_PRICE.toString()
  })
  const [currentPage, setCurrentPage] = useState(1)

  // 정렬 상태 추가
  const [sortBy, setSortBy] = useState<'view_count' | 'discount_price_asc' | 'discount_price_desc'>('view_count')

  // 지역 목록 조회
  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => RegionService.getCities()
  })

  // Depth2 카테고리 조회 (depth1 순서대로 정렬)
  const { data: depth2Categories } = useQuery({
    queryKey: ['categories', 'depth2'],
    queryFn: async () => {
      const depth1Categories = await CategoryService.getDepth1Categories();
      const depth2Categories = await CategoryService.getDepth2Categories();
      
      // depth1의 sort_order 기준으로 depth2 정렬
      return depth2Categories.sort((a, b) => {
        const aParent = depth1Categories.find(d1 => d1.id === a.parent_id);
        const bParent = depth1Categories.find(d1 => d1.id === b.parent_id);
        
        if (aParent && bParent) {
          // 먼저 depth1의 sort_order로 정렬
          if (aParent.sort_order !== bParent.sort_order) {
            return aParent.sort_order - bParent.sort_order;
          }
        }
        // 같은 depth1 내에서는 자신의 sort_order로 정렬
        return a.sort_order - b.sort_order;
      });
    }
  });

  // Depth3 카테고리 조회
  const { data: depth3Categories } = useQuery({
    queryKey: ['categories', 'depth3', filters.depth2Category],
    queryFn: () => filters.depth2Category ? 
      CategoryService.getDepth3Categories(Number(filters.depth2Category)) : 
      Promise.resolve([]),
    enabled: !!filters.depth2Category
  })

  const fetchTreatments = useCallback(async () => {
    const params = {
      depth2_category_id: filters.depth2Category ? Number(filters.depth2Category) : undefined,
      depth3_category_id: filters.depth3Category ? Number(filters.depth3Category) : undefined,
      city_id: filters.city ? Number(filters.city) : undefined,
      is_advertised: filters.status.includes('ad') ? true : undefined,
      is_recommended: filters.status.includes('recommended') ? true : undefined,
      is_discounted: filters.status.includes('discount') ? true : undefined,
      price_from: filters.priceFrom ? Number(filters.priceFrom) : undefined,
      price_to: filters.priceTo ? Number(filters.priceTo) : undefined,
      sort_by: sortBy,  // 정렬 조건 추가
      limit: Number(pageSize),
      offset: (currentPage - 1) * Number(pageSize)
    };

    return getTreatments(params);
  }, [filters, pageSize, currentPage, sortBy]);  // sortBy 의존성 추가

  // 시술 목록 조회
  const { data: treatmentData, isLoading } = useQuery({
    queryKey: ['treatments', currentPage, pageSize, filters, sortBy],
    queryFn: fetchTreatments
  });

  // 가격 입력 필드 변경 시 슬라이더 업데이트
  const handlePriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= 0 && value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]])
      setFilters(prev => ({ ...prev, priceFrom: value.toString() }))
    }
  }

  const handlePriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= priceRange[0] && value <= MAX_PRICE) {
      setPriceRange([priceRange[0], value])
      setFilters(prev => ({ ...prev, priceTo: value.toString() }))
    }
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil((treatmentData?.total_count || 0) / Number(pageSize))
  const pageNumbers = Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1)

  // 가격 범위 변경 시 필터 업데이트 - useEffect 유지
  useEffect(() => {
    if (filters.priceFrom !== priceRange[0].toString() || 
        filters.priceTo !== priceRange[1].toString()) {
      setFilters(prev => ({
        ...prev,
        priceFrom: priceRange[0].toString(),
        priceTo: priceRange[1].toString()
      }))
    }
  }, [priceRange])

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="시술명 검색" className="w-1/4" />
            <div className="flex gap-2 w-3/4">
              <Select 
                value={filters.depth2Category || undefined}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    depth2Category: value || null,
                    depth3Category: null 
                  }))
                }
                className="w-1/4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="시술 분류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>전체</SelectItem>
                  {depth2Categories?.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.depth3Category || undefined}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    depth3Category: value || null 
                  }))
                }
                className="w-1/4"
                disabled={!filters.depth2Category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="세부 분류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>전체</SelectItem>
                  {depth3Categories?.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.city || undefined}
                onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, city: value || null }))
                }
                className="w-1/4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>전체</SelectItem>
                  {regions?.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.status.join(',') || undefined}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    status: value ? value.split(',') : [] 
                  }))
                }
                className="w-1/4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>전체</SelectItem>
                  <SelectItem value="ad">광고</SelectItem>
                  <SelectItem value="recommended">추천</SelectItem>
                  <SelectItem value="discount">할인</SelectItem>
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
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-24">가격 범위</span>
                        <div className="flex-1">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={MAX_PRICE}
                            step={1000000}  // 100만 VND 단위로 조정
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-24">가격 입력</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={MAX_PRICE}
                            placeholder="최소 가격"
                            value={filters.priceFrom}
                            onChange={handlePriceFromChange}
                            className="w-40"
                          />
                          <span>~</span>
                          <Input
                            type="number"
                            min={0}
                            max={MAX_PRICE}
                            placeholder="최대 가격"
                            value={filters.priceTo}
                            onChange={handlePriceToChange}
                            className="w-40"
                          />
                          <span className="text-sm text-muted-foreground">VND</span>
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
          총 <span className="font-medium text-primary">{treatmentData?.total_count || 0}</span>개의 시술
        </div>
        <Select 
          value={sortBy}
          onValueChange={(value: typeof sortBy) => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view_count">조회순</SelectItem>
            <SelectItem value="discount_price_asc">가격낮은순</SelectItem>
            <SelectItem value="discount_price_desc">가격높은순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">번호</TableHead>
              <TableHead className="w-[200px]">시술명/병원명</TableHead>
              <TableHead className="w-[200px]">요약</TableHead>
              <TableHead className="w-[100px]">지역</TableHead>
              <TableHead className="w-[120px]">카테고리</TableHead>
              <TableHead className="w-[180px]">광고/추천/할인</TableHead>
              <TableHead className="w-[200px]">가격정보</TableHead>
              <TableHead className="w-[120px]">등록일자</TableHead>
              <TableHead className="w-[60px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  로딩중...
                </TableCell>
              </TableRow>
            ) : treatmentData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  시술이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              treatmentData?.data.map((treatment, index) => (
                <TableRow key={treatment.id}>
                  <TableCell>
                    {(currentPage - 1) * Number(pageSize) + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{treatment.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {treatment.hospital_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{treatment.summary}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{treatment.city_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {Array.isArray(treatment.categories) && treatment.categories.length > 0 ? (
                        treatment.categories.map((cat) => (
                          <div key={cat.depth2_id}>
                            <Badge variant="secondary">{cat.depth2_name}</Badge>
                          </div>
                        ))
                      ) : (
                        <Badge variant="secondary">미분류</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {treatment.is_advertised && (
                        <Badge variant="default">광고</Badge>
                      )}
                      {treatment.is_recommended && (
                        <Badge variant="default">추천</Badge>
                      )}
                      {treatment.is_discounted && (
                        <Badge variant="destructive">할인중</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {treatment.is_discounted && (
                        <div className="text-sm line-through text-muted-foreground">
                          {treatment.price.toLocaleString()}원
                        </div>
                      )}
                      <div className="font-medium text-destructive">
                        {treatment.discount_price.toLocaleString()}원
                      </div>
                      {treatment.is_discounted && (
                        <Badge variant="destructive">
                          {treatment.discount_rate}% 할인
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(treatment.created_at).toLocaleDateString()}
                    </span>
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
          시술 등록
        </Button>
      </div>
    </div>
  )
} 