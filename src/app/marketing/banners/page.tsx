import { BannerList } from '@/components/marketing/banners/banner-list'
import { PageHeader } from '@/components/common/page-header'
import { Image } from 'lucide-react'

export default function BannersPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="배너 관리"
        description="등록된 배너 목록을 관리할 수 있습니다."
        icon={Image}
      />
      <BannerList />
    </div>
  )
} 