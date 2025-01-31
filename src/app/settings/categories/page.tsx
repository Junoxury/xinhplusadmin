import { CategoryList } from '@/components/settings/categories/category-list'
import { PageHeader } from '@/components/common/page-header'
import { ListTree } from 'lucide-react'

export default function CategoriesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="카테고리 관리"
        description="시술 카테고리를 관리할 수 있습니다."
        icon={ListTree}
      />
      <CategoryList />
    </div>
  )
} 