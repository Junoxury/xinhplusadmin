import { MemberList } from '@/components/members/member-list'
import { PageHeader } from '@/components/common/page-header'
import { Users } from 'lucide-react'

export default function MembersPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="회원 관리"
        description="등록된 회원 목록을 관리할 수 있습니다."
        icon={Users}
      />
      <MemberList />
    </div>
  )
} 