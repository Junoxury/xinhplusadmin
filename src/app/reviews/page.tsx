import { ReviewList } from '@/components/reviews/review-list'
import { PageHeader } from '@/components/common/page-header'
import { MessageSquare } from 'lucide-react'

export default function ReviewsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="리뷰 관리"
        description="등록된 리뷰 목록을 관리할 수 있습니다."
        icon={MessageSquare}
      />
      <ReviewList />
    </div>
  )
} 