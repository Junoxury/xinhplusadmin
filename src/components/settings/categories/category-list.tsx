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
import { CategoryService, type Category } from '@/services/categories'
import { Pencil, Trash2 } from 'lucide-react'

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [depth1Categories, setDepth1Categories] = useState<Category[]>([])
  const [depth2Categories, setDepth2Categories] = useState<Category[]>([])
  const [selectedDepth1, setSelectedDepth1] = useState<number>()
  const [selectedDepth2, setSelectedDepth2] = useState<number>()

  useEffect(() => {
    loadDepth1Categories()
  }, [])

  useEffect(() => {
    if (selectedDepth1) {
      loadDepth2Categories(selectedDepth1)
    } else {
      setDepth2Categories([])
      setSelectedDepth2(undefined)
    }
  }, [selectedDepth1])

  useEffect(() => {
    loadCategories()
  }, [selectedDepth1, selectedDepth2])

  const loadDepth1Categories = async () => {
    try {
      const data = await CategoryService.getDepth1Categories()
      setDepth1Categories(data)
    } catch (error) {
      console.error('Failed to load depth1 categories:', error)
    }
  }

  const loadDepth2Categories = async (depth1Id: number) => {
    try {
      const data = await CategoryService.getDepth2Categories(depth1Id)
      setDepth2Categories(data)
    } catch (error) {
      console.error('Failed to load depth2 categories:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAll({
        depth1Id: selectedDepth1,
        depth2Id: selectedDepth2
      })
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await CategoryService.delete(id)
        await loadCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const getDepthName = (category: Category, targetDepth: number) => {
    // 현재 카테고리가 찾는 depth인 경우
    if (category.depth === targetDepth) return category.name
    
    // 현재 카테고리의 depth가 찾는 depth보다 큰 경우 (상위 카테고리를 찾아야 함)
    if (category.depth > targetDepth) {
      let currentCategory = category
      let parentCategory

      // 원하는 depth를 찾을 때까지 상위로 올라감
      while (currentCategory.depth > targetDepth) {
        parentCategory = categories.find(c => c.id === currentCategory.parent_id)
        if (!parentCategory) return '-'
        currentCategory = parentCategory
      }

      return currentCategory.name
    }

    return '-'
  }

  const handleDepth1Change = (value: string) => {
    setSelectedDepth1(value === "0" ? undefined : Number(value))
  }

  const handleDepth2Change = (value: string) => {
    setSelectedDepth2(value === "0" ? undefined : Number(value))
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-4">
          <Select
            value={selectedDepth1?.toString() || "0"}
            onValueChange={handleDepth1Change}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Depth1 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">전체</SelectItem>
              {depth1Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDepth2?.toString() || "0"}
            onValueChange={handleDepth2Change}
            disabled={!selectedDepth1}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Depth2 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">전체</SelectItem>
              {depth2Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>Depth1</TableHead>
              <TableHead>Depth2</TableHead>
              <TableHead>Depth3</TableHead>
              <TableHead>아이콘</TableHead>
              <TableHead>순서</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{getDepthName(category, 1)}</TableCell>
                <TableCell>{getDepthName(category, 2)}</TableCell>
                <TableCell>{getDepthName(category, 3)}</TableCell>
                <TableCell>
                  {category.icon_path || '-'}
                </TableCell>
                <TableCell>{category.sort_order}</TableCell>
                <TableCell>{category.is_active ? '활성' : '비활성'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(category.id)}
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
          카테고리 등록
        </Button>
      </div>
    </div>
  )
} 