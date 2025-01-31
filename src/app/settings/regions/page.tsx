import { RegionList } from '@/components/settings/regions/region-list'
import { PageHeader } from '@/components/common/page-header'
import { MapPin } from 'lucide-react'

export default function RegionsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="지역 관리"
        description="지역 정보를 관리할 수 있습니다."
        icon={MapPin}
      />
      <RegionList />
    </div>
  )
} 