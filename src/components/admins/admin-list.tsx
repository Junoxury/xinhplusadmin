'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

type Admin = {
  id: string
  email: string
  user_metadata: {
    name: string
    role: 'ADMIN' | 'SUPER_ADMIN'
  }
  last_sign_in_at: string
  created_at: string
}

export function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [emailSearch, setEmailSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  const fetchAdmins = async () => {
    setIsLoading(true)
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      
      if (error) throw error

      // 검색 필터링을 클라이언트 사이드에서 수행
      let filteredUsers = users

      if (nameSearch) {
        filteredUsers = filteredUsers.filter(user => 
          user.user_metadata?.name?.toLowerCase().includes(nameSearch.toLowerCase())
        )
      }

      if (emailSearch) {
        filteredUsers = filteredUsers.filter(user =>
          user.email?.toLowerCase().includes(emailSearch.toLowerCase())
        )
      }
      
      setAdmins(filteredUsers as Admin[])
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 검색어가 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    fetchAdmins()
  }, [nameSearch, emailSearch])

  return (
    <div className="space-y-4">
      {/* 검색 섹션 */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="이름 검색" 
              className="w-1/2"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
            <Input 
              placeholder="이메일 검색" 
              className="w-1/2"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* 테이블 */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">번호</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>최근 접속</TableHead>
              <TableHead>등록일자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  데이터를 불러오는 중...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  등록된 관리자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin, index) => (
                <TableRow key={admin.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell>{admin.user_metadata?.name || '-'}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.user_metadata?.role === 'SUPER_ADMIN' ? '최고관리자' : '관리자'}
                  </TableCell>
                  <TableCell>{admin.last_sign_in_at ? formatDate(admin.last_sign_in_at) : '-'}</TableCell>
                  <TableCell>{formatDate(admin.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 관리자 등록 버튼 */}
      <div className="flex justify-end">
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90"
          disabled
        >
          관리자 등록
        </Button>
      </div>
    </div>
  )
} 