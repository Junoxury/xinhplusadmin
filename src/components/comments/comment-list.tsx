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
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, AlertTriangle, EyeOff, Trash, CornerDownRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useDebounce } from '@/hooks/use-debounce'

// 댓글 상태에 따른 뱃지 색상 정의
const statusColorMap = {
  normal: 'bg-green-500',
  reported: 'bg-yellow-500',
  hidden: 'bg-red-500',
}

interface Comment {
  id: number
  content: string
  treatment_name: string
  hospital_name: string
  author_email: string
  author_nickname: string
  status: 'normal' | 'reported' | 'hidden'
  like_count: number
  created_at: string
  is_reply: boolean
}

const CommentContent = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-center gap-2">
      {comment.is_reply && (
        <span className="flex items-center text-muted-foreground text-sm">
          <CornerDownRight className="h-4 w-4 mr-1" />
          답글
        </span>
      )}
      <span>{comment.content}</span>
    </div>
  )
}

export function CommentList() {
  const [pageSize, setPageSize] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchContent, setSearchContent] = useState('')
  const [searchAuthor, setSearchAuthor] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // 검색어 디바운스 처리
  const debouncedContent = useDebounce(searchContent, 500)
  const debouncedAuthor = useDebounce(searchAuthor, 500)

  // 댓글 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', currentPage, pageSize, debouncedContent, debouncedAuthor, selectedStatus],
    queryFn: async () => {
      console.log('RPC 호출 파라미터:', {
        p_content: debouncedContent || null,
        p_author: debouncedAuthor || null,
        p_status: selectedStatus === 'all' ? null : selectedStatus,
        p_page: currentPage,
        p_page_size: Number(pageSize)
      })

      const { data, error } = await supabase
        .rpc('get_comments', {
          p_content: debouncedContent || undefined,
          p_author: debouncedAuthor || undefined,
          p_status: selectedStatus === 'all' ? undefined : selectedStatus,
          p_page: currentPage,
          p_page_size: Number(pageSize)
        })

      if (error) {
        console.error('RPC 호출 에러:', error)
        throw error
      }

      console.log('RPC 응답 데이터:', data)
      return data as (Comment & { total_count: number })[]
    }
  })

  // 로딩 상태와 에러 상태 UI도 테이블 내부로 이동
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center">
            데이터를 불러오는 중...
          </TableCell>
        </TableRow>
      )
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center text-red-500">
            에러 발생: {(error as Error).message}
          </TableCell>
        </TableRow>
      )
    }

    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
            데이터가 없습니다
          </TableCell>
        </TableRow>
      )
    }

    return data.map((comment, index) => (
      <TableRow key={comment.id}>
        <TableCell>
          {(currentPage - 1) * Number(pageSize) + index + 1}
        </TableCell>
        <TableCell>{comment.treatment_name}</TableCell>
        <TableCell>{comment.hospital_name}</TableCell>
        <TableCell>{comment.author_nickname || comment.author_email}</TableCell>
        <TableCell className="max-w-[300px] truncate">
          <CommentContent comment={comment} />
        </TableCell>
        <TableCell>
          <Badge className={statusColorMap[comment.status]}>
            {comment.status === 'normal' ? '정상' : 
             comment.status === 'reported' ? '신고' : '숨김'}
          </Badge>
        </TableCell>
        <TableCell>{formatDate(comment.created_at)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(comment.id, 'reported')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                신고
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(comment.id, 'hidden')}>
                <EyeOff className="mr-2 h-4 w-4" />
                숨김
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleStatusChange(comment.id, 'hidden')}
              >
                <Trash className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  }

  // 상태 변경 함수
  const handleStatusChange = async (commentId: number, newStatus: string) => {
    const { error } = await supabase
      .rpc('update_comment_status', {
        p_comment_id: commentId,
        p_status: newStatus
      })

    if (error) {
      console.error('상태 변경 실패:', error)
      return
    }
  }

  const totalCount = data?.[0]?.total_count ?? 0
  const totalPages = Math.ceil(totalCount / Number(pageSize))

  return (
    <div className="space-y-4">
      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-[4]">
              <Input 
                placeholder="댓글 내용 검색" 
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
            </div>
            <div className="flex-[4]">
              <Input 
                placeholder="작성자 검색" 
                value={searchAuthor}
                onChange={(e) => setSearchAuthor(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
            </div>
            <div className="flex-[2]">
              <Select 
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="normal">정상</SelectItem>
                  <SelectItem value="reported">신고</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* 테이블 헤더와 정렬 옵션 */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          총 <span className="font-medium text-primary">{totalCount}</span>개의 댓글
        </div>
        <div className="text-sm text-muted-foreground">
          최신순
        </div>
      </div>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">번호</TableHead>
              <TableHead className="w-[120px]">시술</TableHead>
              <TableHead className="w-[150px]">병원명</TableHead>
              <TableHead className="w-[100px]">작성자</TableHead>
              <TableHead>내용</TableHead>
              <TableHead className="w-[100px]">상태</TableHead>
              <TableHead className="w-[120px]">작성일</TableHead>
              <TableHead className="w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableContent()}
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
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>

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
          {/* 페이지 번호 버튼들 */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
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
    </div>
  )
} 