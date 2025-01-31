import { AdminList } from '@/components/admins/admin-list'
import { PageHeader } from '@/components/common/page-header'
import { Users } from 'lucide-react'

export default function AdminsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="관리자 관리"
        description="등록된 관리자 목록을 관리할 수 있습니다."
        icon={Users}
      />
      <AdminList />
    </div>
  )
} 