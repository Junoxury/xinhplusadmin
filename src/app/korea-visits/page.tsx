import { KoreaVisitList } from '@/components/korea-visits/korea-visit-list'
import { PageHeader } from '@/components/common/page-header'
import { Globe } from 'lucide-react'

export default function KoreaVisitsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="한국원정 관리"
        description="등록된 한국원정 목록을 관리할 수 있습니다."
        icon={Globe}
      />
      <KoreaVisitList />
    </div>
  )
} 