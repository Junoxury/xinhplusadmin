import { ApiList } from '@/components/settings/apis/api-list'
import { PageHeader } from '@/components/common/page-header'
import { Webhook } from 'lucide-react'

export default function ApisPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="API 관리"
        description="외부 연동 API를 관리할 수 있습니다."
        icon={Webhook}
      />
      <ApiList />
    </div>
  )
} 