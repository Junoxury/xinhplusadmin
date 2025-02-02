'use client'

import { useState, useEffect } from 'react'
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
import { Eye, Flag, Trash2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'

interface Review {
  id: number
  title: string
  content: string
  rating: number
  author_id: string
  author_name: string
  created_at: string
  treatment_name: string
  hospital_name: string
  is_best: boolean
  is_google: boolean
  is_verified: boolean
  status: string
  total_count: number
}

export function ReviewList() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [approvalStatus, setApprovalStatus] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [googleReview, setGoogleReview] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest')

  const supabase = createClientComponentClient()

  useEffect(() => {
    // 세션 새로고침
    const refreshSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.refreshSession()
      }
    }
    refreshSession()
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', currentPage, pageSize, searchText, searchEmail, approvalStatus, status, googleReview, sortBy],
    queryFn: async () => {
      // RPC 호출 전 파라미터 로깅
      const params = {
        p_limit: pageSize,
        p_offset: (currentPage - 1) * pageSize,
        p_sort_by: sortBy,
        p_is_verified: approvalStatus === 'null' || approvalStatus === '' ? null : approvalStatus === 'true',
        p_status: status === 'null' || status === '' ? null : status,
        p_is_google: googleReview === 'all' ? null : googleReview === 'google'
      }
      console.log('🚀 RPC 호출 파라미터:', params)

      const { data, error } = await supabase
        .rpc('get_reviews', params)

      // RPC 호출 결과 로깅
      if (error) {
        console.error('❌ RPC 에러:', error)
        throw error
      }

      console.log('✅ RPC 응답 데이터:', {
        총_데이터_수: data?.length || 0,
        첫번째_항목: data?.[0],
        마지막_항목: data?.[data?.length - 1]
      })

      if (!data) {
        console.warn('⚠️ RPC 응답 데이터 없음')
        return []
      }

      return data as Review[]
    }
  })

  // 쿼리 상태 로깅
  useEffect(() => {
    console.log('🔄 쿼리 상태:', { 
      isLoading,
      에러: error,
      데이터_수: data?.length,
      현재_페이지: currentPage,
      페이지_크기: pageSize
    })
  }, [data, isLoading, error, currentPage, pageSize])

  console.log('Query Result:', { data, isLoading, error })

  const totalCount = data?.[0]?.total_count ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="리뷰 내용 검색" 
              className="w-1/4"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Input 
              placeholder="이메일/닉네임 검색" 
              className="w-1/4"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <div className="flex gap-2 w-2/4">
              <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                <SelectTrigger className="w-1/3">
                  <SelectValue placeholder="승인상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">전체</SelectItem>
                  <SelectItem value="true">승인</SelectItem>
                  <SelectItem value="false">대기</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-1/3">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">전체</SelectItem>
                  <SelectItem value="published">공개</SelectItem>
                  <SelectItem value="hidden">비공개</SelectItem>
                </SelectContent>
              </Select>
              <Select value={googleReview} onValueChange={setGoogleReview}>
                <SelectTrigger className="w-1/3">
                  <SelectValue placeholder="구글리뷰" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="google">구글리뷰</SelectItem>
                  <SelectItem value="site">사이트리뷰</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* 에러 표시 추가 */}
      {error && (
        <Card className="p-4 bg-red-50">
          <div className="text-red-600">
            에러가 발생했습니다: {(error as Error).message}
          </div>
        </Card>
      )}

      {/* 테이블 헤더와 정렬 옵션 */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          총 <span className="font-medium text-primary">{totalCount}</span>개의 리뷰
        </div>
        <Select value={sortBy} onValueChange={(value: 'latest' | 'rating') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="rating">평점순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">번호</TableHead>
              <TableHead className="w-[200px]">시술명/병원</TableHead>
              <TableHead className="w-[200px]">이메일/작성자</TableHead>
              <TableHead>내용보기</TableHead>
              <TableHead className="w-[100px]">승인</TableHead>
              <TableHead className="w-[100px]">상태</TableHead>
              <TableHead className="w-[100px]">구글</TableHead>
              <TableHead className="w-[150px]">작성일자</TableHead>
              <TableHead className="w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  데이터가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              data.map((review, index) => (
                <TableRow key={review.id}>
                  <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{review.treatment_name}</span>
                      <span className="text-sm text-muted-foreground">{review.hospital_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{review.author_name}</span>
                      <span className="text-sm text-muted-foreground">{review.author_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      내용보기
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      review.is_verified 
                        ? "bg-green-100 text-green-600" 
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {review.is_verified ? "승인" : "대기"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      review.status === 'hidden'
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {review.status === 'hidden' ? "비공개" : "공개"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      review.is_google 
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {review.is_google ? "구글" : "사이트"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Flag className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <Select 
          value={String(pageSize)} 
          onValueChange={(value) => {
            setPageSize(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="페이지당 항목 수" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            처음
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          {/* 페이지 버튼들 */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            마지막
          </Button>
        </div>
      </div>
    </div>
  )
} 