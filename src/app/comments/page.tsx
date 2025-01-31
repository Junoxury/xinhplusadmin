import { CommentList } from '@/components/comments/comment-list'
import { PageHeader } from '@/components/common/page-header'
import { MessageCircle } from 'lucide-react'

export default function CommentsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="댓글 관리"
        description="등록된 댓글 목록을 관리할 수 있습니다."
        icon={MessageCircle}
      />
      <CommentList />
    </div>
  )
} 