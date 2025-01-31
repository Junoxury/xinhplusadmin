'use client'

import { useState, useEffect } from 'react'
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
import { HospitalService, type Hospital, type GetHospitalsParams } from '@/services/hospitals'
import { Pencil, Trash2 } from 'lucide-react'
import { RegionService, type City } from '@/services/regions'
import Image from 'next/image'
import { CategoryService, type Category } from '@/services/categories'

export function HospitalList() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [params, setParams] = useState<GetHospitalsParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'latest'
  })
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState('10')
  const [selectedDepth2Id, setSelectedDepth2Id] = useState<string>("0")
  const [selectedDepth3Id, setSelectedDepth3Id] = useState<string>("0")
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    isAd: false,
    isRecommended: false,
    isMember: false,
    hasGoogleMap: false,
  })
  const [cities, setCities] = useState<City[]>([])
  const [depth2Categories, setDepth2Categories] = useState<Category[]>([])
  const [depth3Categories, setDepth3Categories] = useState<Category[]>([])

  useEffect(() => {
    console.log('params changed:', params)
    loadHospitals()
  }, [params])

  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    loadDepth2Categories()
  }, [])

  useEffect(() => {
    if (selectedDepth2Id && selectedDepth2Id !== "0") {
      loadDepth3Categories(Number(selectedDepth2Id))
      setSelectedDepth3Id("0")
    } else {
      setDepth3Categories([])
      setSelectedDepth3Id("0")
    }
  }, [selectedDepth2Id])

  useEffect(() => {
    console.log('category changed - depth2:', selectedDepth2Id, 'depth3:', selectedDepth3Id)
    setParams(prev => ({
      ...prev,
      depth2TreatmentCategoryId: selectedDepth3Id !== "0" ? undefined : 
        selectedDepth2Id === "0" ? undefined : Number(selectedDepth2Id),
      depth3TreatmentCategoryId: selectedDepth3Id === "0" ? undefined : Number(selectedDepth3Id),
      page: 1
    }))
  }, [selectedDepth2Id, selectedDepth3Id])

  const loadHospitals = async () => {
    try {
      console.log('calling RPC with params:', params)
      const data = await HospitalService.getHospitals(params)
      console.log(`RPC result: ${data.length} hospitals found, total: ${data[0]?.total_count || 0}`)
      
      setHospitals(data)
      setTotalCount(data[0]?.total_count || 0)
    } catch (error) {
      console.error('Failed to load hospitals:', error)
    }
  }

  const loadCities = async () => {
    try {
      const data = await RegionService.getAll('name')
      setCities(data)
    } catch (error) {
      console.error('Failed to load cities:', error)
    }
  }

  const loadDepth2Categories = async () => {
    try {
      const data = await CategoryService.getDepth2Categories()
      setDepth2Categories(data)
    } catch (error) {
      console.error('Failed to load depth2 categories:', error)
    }
  }

  const loadDepth3Categories = async (depth2Id: number) => {
    try {
      const data = await CategoryService.getDepth3Categories(depth2Id)
      setDepth3Categories(data)
    } catch (error) {
      console.error('Failed to load depth3 categories:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }))
  }

  const handleSortChange = (sortBy: 'latest' | 'views' | 'rating' | 'likes') => {
    setParams(prev => ({ ...prev, sortBy }))
  }

  const handleCityChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      cityId: value === "0" ? undefined : Number(value)
    }))
  }

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input placeholder="병원명 검색" className="w-1/3" />
            <div className="flex gap-2 w-2/3">
              <Select 
                className="w-1/3"
                value={params.cityId?.toString() || "0"}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">전체</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                className="w-1/3"
                value={selectedDepth2Id}
                onValueChange={(value) => {
                  setSelectedDepth2Id(value)
                  setSelectedDepth3Id("0")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시술 방법(대분류)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">전체</SelectItem>
                  {depth2Categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                className="w-1/3"
                value={selectedDepth3Id}
                onValueChange={setSelectedDepth3Id}
                disabled={!selectedDepth2Id || selectedDepth2Id === "0"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시술 방법(소분류)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">전체</SelectItem>
                  {depth3Categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
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
          총 <span className="font-medium text-primary">{totalCount}</span>개의 병원
        </div>
        <Select
          value={params.sortBy}
          onValueChange={(value: 'latest' | 'views' | 'rating' | 'likes') => handleSortChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="views">조회순</SelectItem>
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
              <TableHead>썸네일</TableHead>
              <TableHead>병원명</TableHead>
              <TableHead>도시</TableHead>
              <TableHead>소개</TableHead>
              <TableHead>광고</TableHead>
              <TableHead>추천</TableHead>
              <TableHead>멤버</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.length > 0 ? (
              hospitals.map((hospital, index) => (
                <TableRow key={hospital.id}>
                  <TableCell>{(params.page - 1) * params.pageSize + index + 1}</TableCell>
                  <TableCell>
                    {hospital.thumbnail_url ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={hospital.thumbnail_url}
                          alt={hospital.hospital_name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell>{hospital.hospital_name}</TableCell>
                  <TableCell>{hospital.city_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{hospital.description}</TableCell>
                  <TableCell>{hospital.is_advertised ? "Y" : "N"}</TableCell>
                  <TableCell>{hospital.is_recommended ? "Y" : "N"}</TableCell>
                  <TableCell>{hospital.is_member ? "Y" : "N"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  조회된 병원이 없습니다.
                </TableCell>
              </TableRow>
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
            <Button
              variant="outline"
              onClick={() => handlePageChange(params.page - 1)}
              disabled={params.page === 1}
            >
              이전
            </Button>
            <Button variant="outline" disabled>
              {params.page} / {Math.ceil(totalCount / params.pageSize)}
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(params.page + 1)}
              disabled={params.page >= Math.ceil(totalCount / params.pageSize)}
            >
              다음
            </Button>
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