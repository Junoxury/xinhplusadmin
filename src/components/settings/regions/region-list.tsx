'use client'

import { useState, useEffect } from 'react'
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
import { RegionService, type City } from '@/services/regions'
import { Pencil, Trash2 } from 'lucide-react'

export function RegionList() {
  const [orderBy, setOrderBy] = useState<'name' | 'sort_order'>('sort_order')
  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    loadCities()
  }, [orderBy])

  const loadCities = async () => {
    try {
      const data = await RegionService.getAll(orderBy)
      setCities(data)
    } catch (error) {
      console.error('Failed to load cities:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await RegionService.delete(id)
        await loadCities()
      } catch (error) {
        console.error('Failed to delete city:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* 테이블 헤더와 정렬 옵션 */}
      <div className="flex justify-end">
        <Select value={orderBy} onValueChange={(v: 'name' | 'sort_order') => setOrderBy(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sort_order">노출 순서</SelectItem>
            <SelectItem value="name">이름순</SelectItem>
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
              <TableHead>베트남어명</TableHead>
              <TableHead>한국어명</TableHead>
              <TableHead>순서</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city, index) => (
              <TableRow key={city.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.name_vi}</TableCell>
                <TableCell>{city.name_ko}</TableCell>
                <TableCell>{city.sort_order}</TableCell>
                <TableCell>{city.is_active ? '활성' : '비활성'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(city.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-end">
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