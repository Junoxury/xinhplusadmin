'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import { supabase } from '@/lib/supabase'
import { fetchAdmins } from '@/services/admins'
import type { Admin } from '@/types/admin'

export function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [nameSearch, setNameSearch] = useState('')
  const [emailSearch, setEmailSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchAdminsData = useCallback(async () => {
    setIsLoading(true)
    try {
      const adminsData = await fetchAdmins()
      console.log('RPC Response:', adminsData)
      
      let filteredUsers = adminsData || []
      console.log('Filtered Users:', filteredUsers)

      if (nameSearch) {
        filteredUsers = filteredUsers.filter(user => 
          user.name?.toLowerCase().includes(nameSearch.toLowerCase())
        )
      }

      if (emailSearch) {
        filteredUsers = filteredUsers.filter(user =>
          user.email?.toLowerCase().includes(emailSearch.toLowerCase())
        )
      }
      
      console.log('Final Admins Data:', filteredUsers)
      setAdmins(filteredUsers)
    } catch (error) {
      console.error('Error in fetchAdmins:', error)
    } finally {
      setIsLoading(false)
    }
  }, [nameSearch, emailSearch])

  useEffect(() => {
    fetchAdminsData()
  }, [fetchAdminsData])

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
                  <TableCell>{admin.name || '-'}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.role === 'admin' ? (
                      <Badge variant="default">관리자</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        승인대기
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{admin.last_sign_in_at ? formatDate(admin.last_sign_in_at) : '-'}</TableCell>
                  <TableCell>{admin.created_at ? formatDate(admin.created_at) : '-'}</TableCell>
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