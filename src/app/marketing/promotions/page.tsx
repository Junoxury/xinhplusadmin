import { PromotionList } from '@/components/marketing/promotions/promotion-list'
import { PageHeader } from '@/components/common/page-header'
import { LayoutGrid } from 'lucide-react'

export default function PromotionsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="기획전 관리"
        description="등록된 기획전 목록을 관리할 수 있습니다."
        icon={LayoutGrid}
      />
      <PromotionList />
    </div>
  )
} 