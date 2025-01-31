import { ProcedureList } from '@/components/procedures/procedure-list'
import { PageHeader } from '@/components/common/page-header'
import { Stethoscope } from 'lucide-react'

export default function ProceduresPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="시술 관리"
        description="등록된 시술 목록을 관리할 수 있습니다."
        icon={Stethoscope}
      />
      <ProcedureList />
    </div>
  )
} 