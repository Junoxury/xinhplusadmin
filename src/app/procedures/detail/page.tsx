'use client'

import { PageHeader } from '@/components/common/page-header'
import { 
  Stethoscope, 
  Globe, 
  Facebook, 
  Phone, 
  ChevronLeft,
  Eye,
  Heart,
  MessageCircle,
  Star
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getTreatmentDetail } from '@/services/treatments'

// RPC 결과값에 맞는 타입 정의
type TreatmentDetail = {
  id: number
  hospital_id: number
  hospital_name: string
  title: string
  summary: string
  detail_content: string
  city_id: number
  city_name: string
  thumbnail_url: string
  price: number
  discount_price: number
  discount_rate: number
  rating: number
  view_count: number
  like_count: number
  comment_count: number
  is_advertised: boolean
  is_recommended: boolean
  is_discounted: boolean
  created_at: string
  updated_at: string
  website: string
  facebook_url: string
  zalo_id: string
  phone: string
  categories: {
    depth2_id: number
    depth2_name: string
    depth3_list: Array<{
      id: number
      name: string
    }>
  }[]
}

export default function ProcedureDetailPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const router = useRouter()
  
  const { data: treatment, isLoading, error } = useQuery({
    queryKey: ['treatment', searchParams.id],
    queryFn: () => getTreatmentDetail(Number(searchParams.id)),
    enabled: !!searchParams.id
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="시술 상세"
            description="시술 정보를 확인하고 관리할 수 있습니다."
            icon={Stethoscope}
          />
        </div>
        <div className="mt-6 text-center">로딩중...</div>
      </div>
    )
  }

  if (error || !treatment) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="시술 상세"
            description="시술 정보를 확인하고 관리할 수 있습니다."
            icon={Stethoscope}
          />
        </div>
        <div className="mt-6 text-center text-destructive">
          시술 정보를 불러오는데 실패했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="시술 상세"
            description="시술 정보를 확인하고 관리할 수 있습니다."
            icon={Stethoscope}
          />
        </div>

        {treatment.thumbnail_url && (
          <div className="aspect-[16/9] max-h-[320px] w-full overflow-hidden rounded-lg bg-muted">
            <img 
              src={treatment.thumbnail_url} 
              alt={treatment.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{treatment.name}</h2>
                <p className="text-muted-foreground">{treatment.hospital_name}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {treatment.view_count.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {treatment.like_count.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {treatment.comment_count.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {treatment.rating}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  {treatment.is_advertised && <Badge>광고</Badge>}
                  {treatment.is_recommended && <Badge variant="secondary">추천</Badge>}
                  {treatment.is_discounted && <Badge variant="destructive">할인중</Badge>}
                </div>
                <Button 
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => window.open('https://xinhplus.com', '_blank')}
                >
                  Xinh+에서 보기
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">시술 요약</h3>
            <p>{treatment.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">상세 설명</h3>
            <div 
              className="prose prose-sm max-w-none bg-muted/30 rounded-lg p-4 
                prose-headings:text-foreground 
                prose-p:text-muted-foreground 
                max-h-[600px] 
                overflow-y-auto
                [&::-webkit-scrollbar]:w-4
                [&::-webkit-scrollbar-track]:bg-slate-200
                [&::-webkit-scrollbar-thumb]:bg-slate-400
                [&::-webkit-scrollbar-thumb]:rounded-md
                [&::-webkit-scrollbar-thumb]:border
                [&::-webkit-scrollbar-thumb]:border-slate-200
                hover:[&::-webkit-scrollbar-thumb]:bg-slate-500
                [&_img]:!rounded-lg
                [&_img]:!max-h-none
                [&_img]:!w-full
                [&_img]:!object-fill"
              dangerouslySetInnerHTML={{ __html: treatment.detail_content }} 
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">가격 정보</h3>
              {treatment.is_discounted && (
                <p className="text-muted-foreground line-through">
                  {treatment.original_price.toLocaleString()}원
                </p>
              )}
              <p className="text-2xl font-bold text-destructive">
                {treatment.discounted_price.toLocaleString()}원
              </p>
              {treatment.is_discounted && (
                <Badge variant="destructive">{treatment.discount_rate}% 할인</Badge>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">카테고리</h3>
              <div className="space-y-2">
                {treatment.categories.map((cat: TreatmentDetail['categories'][0]) => (
                  <div key={cat.depth2_id} className="space-y-1">
                    <Badge variant="outline">{cat.depth2_name}</Badge>
                    <div className="flex gap-1 flex-wrap">
                      {cat.depth3_list.map((depth3: TreatmentDetail['categories'][0]['depth3_list'][0]) => (
                        <Badge key={depth3.id} variant="secondary">
                          {depth3.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">위치</h3>
              <p>{treatment.city_name}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">병원 연락처</h3>
              <div className="space-y-2 text-sm">
                {treatment.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={treatment.website} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      웹사이트 방문
                    </a>
                  </div>
                )}
                {treatment.facebook_url && (
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    <a href={treatment.facebook_url} target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline">
                      페이스북 페이지
                    </a>
                  </div>
                )}
                {treatment.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{treatment.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">등록 정보</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>등록: {new Date(treatment.created_at).toLocaleDateString()}</p>
                <p>수정: {new Date(treatment.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
