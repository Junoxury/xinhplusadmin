import { 
  ChevronLeft, 
  MapPin, 
  Eye, 
  MessageSquare, 
  Heart, 
  Star,
  Globe,
  Facebook,
  Youtube,
  Instagram
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { HospitalDetail } from "./types"
import { HospitalService } from "@/services/hospitals"
import { notFound } from "next/navigation"

interface Props {
  searchParams: { id?: string }
}

// 영업시간 포맷팅 함수 추가
function formatBusinessHours(hours: string) {
  return hours.split('\\n').map((line, index) => (
    <span key={index} className="block">{line}</span>
  ))
}

// 카테고리 그룹화 함수 수정
function groupCategories(categories: HospitalDetail['categories']) {
  const grouped = new Map()
  
  categories?.forEach(cat => {
    if (!grouped.has(cat.depth2.id)) {
      grouped.set(cat.depth2.id, {
        depth2: cat.depth2,
        depth3: []
      })
    }
    // depth3 카테고리를 바로 추가
    grouped.get(cat.depth2.id).depth3.push(cat.depth3)
  })

  return Array.from(grouped.values())
}

export default async function HospitalDetailPage({ searchParams }: Props) {
  const id = searchParams.id ? parseInt(searchParams.id) : null

  if (!id) {
    notFound()
  }

  try {
    const hospitalData = await HospitalService.getHospitalDetail(id)

    if (!hospitalData) {
      notFound()
    }

    return (
      <div className="space-y-6 p-8">
        {/* 헤더 섹션 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/hospitals">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">병원 상세 정보</h1>
        </div>

        <Separator />

        {/* 썸네일 이미지 */}
        {hospitalData.thumbnail_url && (
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
            <Image
              src={hospitalData.thumbnail_url}
              alt={hospitalData.hospital_name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              {/* 첫 번째 줄: 병원명과 지도 버튼 */}
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{hospitalData.hospital_name}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Xinh+에서 보기
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-semibold shadow-sm hover:shadow-md transition-shadow"
                    asChild
                  >
                    <Link 
                      href={`https://www.google.com/maps/search/?api=1&query=${hospitalData.latitude},${hospitalData.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Google Maps
                    </Link>
                  </Button>
                </div>
              </div>

              {/* 두 번째 줄: 카테고리 */}
              <div className="space-y-2">
                {/* depth2 카테고리 반복 */}
                {Array.from(new Set(hospitalData.categories?.map(cat => cat.depth2.id))).map(depth2Id => {
                  // 현재 depth2에 해당하는 카테고리 찾기
                  const currentCategory = hospitalData.categories?.find(cat => cat.depth2.id === depth2Id)
                  
                  return (
                    <div key={depth2Id} className="flex items-center gap-2">
                      <Badge variant="secondary" className="shrink-0">
                        {currentCategory?.depth2.label}
                      </Badge>
                      <span className="text-muted-foreground">:</span>
                      <div className="flex flex-wrap gap-1">
                        {/* depth3 배열 순회 */}
                        {currentCategory?.depth3.map((depth3: any, idx: number) => (
                          <Badge key={`${depth2Id}-${idx}`} variant="outline" className="text-xs">
                            {depth3.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 세 번째 줄: 위치와 뱃지들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{hospitalData.city_name_ko}</span>
                </div>
                <div className="flex gap-2">
                  {hospitalData.is_advertised && (
                    <Badge>광고</Badge>
                  )}
                  {hospitalData.is_recommended && (
                    <Badge variant="secondary">추천</Badge>
                  )}
                  {hospitalData.is_member && (
                    <Badge variant="outline">멤버</Badge>
                  )}
                  {hospitalData.is_google && (
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                      구글
                    </Badge>
                  )}
                </div>
              </div>

              {/* 네 번째 줄: 설명 */}
              {hospitalData.description && (
                <p className="text-muted-foreground">{hospitalData.description}</p>
              )}

              {/* 다섯 번째 줄: 통계 */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{hospitalData.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">0</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{hospitalData.like_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{hospitalData.average_rating}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">연락처</label>
                <p className="text-base">{hospitalData.phone}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">이메일</label>
                <p className="text-base">{hospitalData.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">영업시간</label>
                <p className="text-base leading-relaxed">
                  {formatBusinessHours(hospitalData.business_hours)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">평점</label>
                <p className="text-base">{hospitalData.average_rating} / 5.0</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">주소</label>
                <p className="text-base">{hospitalData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 설명 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">상세 정보</h2>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none 
              prose-headings:font-semibold 
              prose-h1:text-xl 
              prose-h2:text-lg 
              prose-h3:text-base 
              prose-p:text-muted-foreground 
              prose-strong:font-semibold 
              prose-strong:text-foreground
              prose-ul:list-disc 
              prose-ul:list-inside
              prose-ol:list-decimal 
              prose-ol:list-inside
              prose-li:text-muted-foreground
              prose-table:border-collapse
              prose-th:border 
              prose-th:border-border 
              prose-th:p-2
              prose-td:border 
              prose-td:border-border 
              prose-td:p-2
              prose-img:rounded-md
              prose-img:my-4
              prose-a:text-primary
              prose-a:no-underline
              hover:prose-a:underline
            ">
              <div dangerouslySetInnerHTML={{ __html: hospitalData.detail_content }} />
            </div>
          </CardContent>
        </Card>

        {/* SNS 링크 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">SNS & 웹사이트</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {hospitalData.website && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={hospitalData.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    웹사이트
                  </Link>
                </Button>
              )}
              {hospitalData.facebook_url && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={hospitalData.facebook_url} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Link>
                </Button>
              )}
              {hospitalData.youtube_url && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={hospitalData.youtube_url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </Link>
                </Button>
              )}
              {hospitalData.tiktok_url && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={hospitalData.tiktok_url} target="_blank" rel="noopener noreferrer">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </Link>
                </Button>
              )}
              {hospitalData.instagram_url && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={hospitalData.instagram_url} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Link>
                </Button>
              )}
              {hospitalData.zalo_id && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`https://zalo.me/${hospitalData.zalo_id}`} target="_blank" rel="noopener noreferrer">
                    <span className="mr-2 font-bold">Z</span>
                    Zalo
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Failed to load hospital detail:', error)
    notFound()
  }
} 