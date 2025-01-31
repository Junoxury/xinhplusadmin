import { HospitalList } from '@/components/hospitals/hospital-list'
import { PageHeader } from '@/components/common/page-header'
import { Building2 } from 'lucide-react'

export default function HospitalsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="병원 관리"
        description="등록된 병원 목록을 관리할 수 있습니다."
        icon={Building2}
      />
      <HospitalList />
    </div>
  )
} 