'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { HospitalService, type GetHospitalsParams, type HospitalWithCount } from '@/services/hospitals'
import { Pencil, Trash2 } from 'lucide-react'
import { RegionService, type City } from '@/services/regions'
import Image from 'next/image'
import { CategoryService, type Category } from '@/services/categories'
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Link from 'next/link'
import { useDebounce } from '@/hooks/use-debounce'

export function HospitalList() {
  const [hospitals, setHospitals] = useState<HospitalWithCount[]>([])
  const [params, setParams] = useState<GetHospitalsParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'latest',
    is_advertised: undefined,
    is_recommended: undefined,
    is_member: undefined
  })
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState('10')
  const [selectedDepth2Id, setSelectedDepth2Id] = useState<string>("0")
  const [selectedDepth3Id, setSelectedDepth3Id] = useState<string>("0")
  
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'ad' | 'recommended' | 'member' | 'google'
  })
  const [cities, setCities] = useState<City[]>([])
  const [depth2Categories, setDepth2Categories] = useState<Category[]>([])
  const [depth3Categories, setDepth3Categories] = useState<Category[]>([])
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const loadHospitals = useCallback(async () => {
    try {
      console.log('calling RPC with params:', params)
      const data = await HospitalService.getHospitals(params)
      console.log(`RPC result: ${data.length} hospitals found, total: ${data[0]?.total_count || 0}`)
      
      setHospitals(data)
      setTotalCount(data[0]?.total_count || 0)
    } catch (error) {
      console.error('Failed to load hospitals:', error)
    }
  }, [params])

  useEffect(() => {
    loadHospitals()
  }, [loadHospitals])

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

  useEffect(() => {
    setParams(prev => ({
      ...prev,
      is_advertised: filters.status === 'ad' ? true : undefined,
      is_recommended: filters.status === 'recommended' ? true : undefined,
      is_member: filters.status === 'member' ? true : undefined,
      is_google: filters.status === 'google' ? true : undefined,
      page: 1
    }))
  }, [filters.status])

  useEffect(() => {
    setParams(prev => ({
      ...prev,
      searchTerm: debouncedSearchTerm || undefined,
      page: 1
    }))
  }, [debouncedSearchTerm])

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

  const handleDelete = async (e: React.MouseEvent, hospitalId: number) => {
    e.stopPropagation() // row 클릭 이벤트 전파 방지
    try {
      await HospitalService.deleteHospital(hospitalId)
      toast.success('병원이 성공적으로 삭제되었습니다')
      loadHospitals() // 목록 새로고침
    } catch (error) {
      console.error('병원 삭제 실패:', error)
      toast.error('병원을 삭제하는 중 오류가 발생했습니다')
    }
  }

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="병원명 검색" 
              className="w-1/4" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 w-3/4">
              <div className="w-[140px]">
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

              <div className="w-[140px]">
                <Select 
                  value={params.cityId?.toString() || "0"}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="지역" />
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
              </div>

              <div className="w-[140px]">
                <Select 
                  value={selectedDepth2Id}
                  onValueChange={(value) => {
                    setSelectedDepth2Id(value)
                    setSelectedDepth3Id("0")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시술 대분류" />
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
              </div>

              <div className="w-[140px]">
                <Select 
                  value={selectedDepth3Id}
                  onValueChange={setSelectedDepth3Id}
                  disabled={!selectedDepth2Id || selectedDepth2Id === "0"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시술 소분류" />
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
              <TableHead>구글</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.length > 0 ? (
              hospitals.map((hospital, index) => (
                <TableRow 
                  key={hospital.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/hospitals/detail?id=${hospital.id}`)}
                >
                  <TableCell>{((params.page || 1) - 1) * (params.pageSize || 10) + index + 1}</TableCell>
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
                  <TableCell>{hospital.is_google ? "Y" : "N"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => e.stopPropagation()} // row 클릭 이벤트 전파 방지
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>병원 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말 이 병원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                              취소
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => handleDelete(e, hospital.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
              onClick={() => handlePageChange(params.page! - 1)}
              disabled={params.page === 1}
            >
              이전
            </Button>
            <Button variant="outline" disabled>
              {params.page} / {Math.ceil(totalCount / (params.pageSize || 10))}
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(params.page! + 1)}
              disabled={params.page! >= Math.ceil(totalCount / (params.pageSize || 10))}
            >
              다음
            </Button>
          </div>
        </div>

        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90"
          asChild
        >
          <Link href="/hospitals/form">
            병원 등록
          </Link>
        </Button>
      </div>
    </div>
  )
} 