'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TiptapEditor } from '@/components/common/tiptap-editor'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query'
import { RegionService, getRegions } from '@/services/regions'
import { CategoryService } from '@/services/categories'
import { FileUpload } from '@/components/ui/file-upload'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { HospitalService } from '@/services/hospitals'

const formSchema = z.object({
  hospital_name: z.string().min(2, '병원명은 2자 이상이어야 합니다'),
  thumbnail_url: z.string().min(1, '썸네일 이미지를 업로드해주세요'),
  description: z.string().min(10, '간단 설명을 10자 이상 입력해주세요'),
  categories: z.array(z.object({
    depth2: z.string(),
    depth3: z.array(z.string())
  })).min(1, '최소 1개의 카테고리를 선택해주세요'),
  address: z.string().min(5, '주소를 입력해주세요'),
  latitude: z.string()
    .refine(val => !isNaN(parseFloat(val)), '숫자를 입력해주세요')
    .refine(val => parseFloat(val) >= -90 && parseFloat(val) <= 90, '위도는 -90에서 90 사이여야 합니다'),
  longitude: z.string()
    .refine(val => !isNaN(parseFloat(val)), '숫자를 입력해주세요')
    .refine(val => parseFloat(val) >= -180 && parseFloat(val) <= 180, '경도는 -180에서 180 사이여야 합니다'),
  business_hours: z.string(),
  website: z.string().url().optional(),
  facebook_url: z.string().url().optional(),
  zalo_id: z.string().optional(),
  phone: z.string().min(5, '전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  detail_content: z.string().min(1, '상세 설명을 입력해주세요'),
  is_advertised: z.boolean().default(false),
  is_recommended: z.boolean().default(false),
  is_member: z.boolean().default(false),
  is_google: z.boolean().default(false),
  google_map_url: z.string().url().optional(),
  region: z.string().min(1, '지역을 선택해주세요'),
  city_id: z.number().optional(),
})

// 카테고리 데이터 예시
const categoryData = [
  {
    depth2: '성형외과',
    depth3: ['눈 성형', '코 성형', '안면윤곽', '가슴 성형', '지방흡입']
  },
  {
    depth2: '피부과',
    depth3: ['레이저', '보톡스', '필러', '리프팅', '여드름']
  },
  // ... 더 많은 카테고리
]

// 지역 데이터 추가
const regions = [
  "하노이",
  "호치민",
  "다낭",
  "나트랑",
  "붕따우",
  "하이퐁",
  "후에"
]

export default function HospitalForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_advertised: false,
      is_recommended: false,
      is_member: false,
      is_google: false,
      categories: [],
      region: '',
      latitude: '',
      longitude: '',
    },
  })

  // 현재 선택된 depth2 관리
  const [currentDepth2, setCurrentDepth2] = useState<string>('')
  
  // 선택된 카테고리들 관리
  const [selectedCategories, setSelectedCategories] = useState<{
    depth2: string;
    depth3: string[];
  }[]>([])

  // 선택된 지역 상태 추가
  const [selectedRegion, setSelectedRegion] = useState<string>("")

  // 지역 데이터 가져오기 - getRegions() 함수로 변경
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: getRegions,  // sort_order로 정렬된 데이터를 가져오는 함수로 변경
  })

  // depth2 카테고리 가져오기
  const { data: depth2Categories = [] } = useQuery({
    queryKey: ['categories', 'depth2'],
    queryFn: () => CategoryService.getDepth2Categories(),
  })

  // depth3 카테고리 전체를 가져오도록 수정
  const { data: allDepth3Categories = [] } = useQuery({
    queryKey: ['categories', 'depth3', 'all'],
    queryFn: () => CategoryService.getAllDepth3Categories(),  // 모든 depth3 카테고리 가져오기
  })

  // 현재 depth2에 해당하는 depth3 카테고리 필터링
  const depth3Categories = allDepth3Categories.filter(cat => {
    const parent = depth2Categories.find(d2 => d2.name === currentDepth2)
    return parent && cat.parent_id === parent.id
  })

  // regions 배열을 cities 데이터로 대체
  const regions = cities.map(city => city.name)

  // 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false)

  // depth2 선택 처리
  const handleDepth2Select = (value: string) => {
    setCurrentDepth2(value)
    const category = depth2Categories.find(cat => cat.name === value)
    if (category && !selectedCategories.some(cat => cat.depth2 === value)) {
      const newCategories = [...selectedCategories, { depth2: value, depth3: [] }]
      setSelectedCategories(newCategories)
      form.setValue('categories', newCategories)  // 즉시 업데이트
    }
  }

  // depth3 선택 처리
  const handleDepth3Select = (value: string) => {
    const updatedCategories = selectedCategories.map(cat => {
      if (cat.depth2 === currentDepth2) {
        return {
          ...cat,
          depth3: cat.depth3.includes(value) 
            ? cat.depth3.filter(d => d !== value)
            : [...cat.depth3, value]
        }
      }
      return cat
    })
    setSelectedCategories(updatedCategories)
    form.setValue('categories', updatedCategories)  // 즉시 업데이트
  }

  // 지역 선택 처리
  const handleRegionSelect = (cityId: number, cityName: string) => {
    setSelectedRegion(cityName)
    form.setValue('region', cityName)
    form.setValue('city_id', cityId)
  }

  // 주소 입력 시 지역 자동 선택 처리
  const handleAddressChange = (value: string) => {
    const region = regions.find(r => value.includes(r))
    if (region) {
      setSelectedRegion(region)
      form.setValue('region', region)
    }
  }

  // 이미지 업로드 처리 함수 수정
  const handleThumbnailUpload = async (file: File | null) => {
    try {
      if (!file) {
        form.setValue('thumbnail_url', '')  // 이미지 삭제 시 값을 비움
        return
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `hospitals/${fileName}`

      const options = {
        contentType: file.type
      }

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, options)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      form.setValue('thumbnail_url', publicUrl)
      toast.success('이미지가 업로드되었습니다')
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      toast.error('썸네일 업로드에 실패했습니다')
    }
  }

  // onSubmit 함수 수정
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // 카테고리 데이터 변환 수정
      const categories = selectedCategories.flatMap(cat => {
        const depth2Category = depth2Categories.find(d2 => d2.name === cat.depth2)
        return cat.depth3.map(d3Name => {
          // 전체 depth3 카테고리에서 찾기
          const depth3Category = allDepth3Categories.find(d3 => 
            d3.name === d3Name && 
            d3.parent_id === depth2Category?.id
          )
          return {
            depth2_category_id: depth2Category?.id,
            depth3_category_id: depth3Category?.id
          }
        })
      })

      // 병원 데이터 준비
      const hospitalData = {
        hospital_name: values.hospital_name,
        city_id: values.city_id,
        business_hours: values.business_hours,
        address: values.address,
        phone: values.phone,
        email: values.email,
        website: values.website || null,
        facebook_url: values.facebook_url || null,
        youtube_url: null,
        tiktok_url: null,
        instagram_url: null,
        zalo_id: values.zalo_id || null,
        description: values.description,
        thumbnail_url: values.thumbnail_url,
        detail_content: values.detail_content,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        is_advertised: values.is_advertised,
        is_recommended: values.is_recommended,
        is_member: values.is_member,
        is_google: values.is_google,
        google_map_url: values.google_map_url || null
      }

      // RPC 호출하여 저장
      const result = await HospitalService.create(hospitalData, categories)

      if (result.success) {
        toast.success('병원이 성공적으로 등록되었습니다')
        router.push('/hospitals')  // 목록 페이지로 이동
      } else {
        toast.error('병원 등록에 실패했습니다: ' + result.error)
      }

    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('병원 정보 저장에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>병원 정보 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 병원명 */}
              <FormField
                control={form.control}
                name="hospital_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>병원명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="병원명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 썸네일 이미지 업로드 필드 - 병원명 바로 아래 */}
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>썸네일 이미지 *</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={handleThumbnailUpload}
                        accept="image/*"
                      />
                    </FormControl>
                    <FormDescription>
                      대표 이미지를 업로드해주세요 (최대 10MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 옵션 설정 - 썸네일 이미지 아래로 이동 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="is_advertised"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">광고</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_recommended"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">추천</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_member"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">멤버</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_google"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">구글</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* 간단 설명 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>간단 설명 *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="병원에 대한 간단한 설명을 입력하세요" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 카테고리 */}
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>카테고리 *</FormLabel>
                    <div className="space-y-4">
                      {/* 선택된 카테고리 목록 */}
                      <div className="space-y-2">
                        {selectedCategories.map((category) => (
                          <div key={category.depth2} className="rounded-lg border p-3">
                            <div className="font-medium">{category.depth2}</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {category.depth3.map((subCat) => (
                                <div 
                                  key={subCat}
                                  className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-sm flex items-center gap-1"
                                >
                                  {subCat}
                                  <button
                                    type="button"
                                    onClick={() => handleDepth3Select(subCat)}
                                    className="hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 카테고리 선택기 */}
                      <div className="grid grid-cols-2 gap-4">
                        <Select onValueChange={handleDepth2Select} value={currentDepth2}>
                          <SelectTrigger>
                            <SelectValue placeholder="대분류 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {depth2Categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {currentDepth2 && (
                          <Select onValueChange={handleDepth3Select}>
                            <SelectTrigger>
                              <SelectValue placeholder="소분류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {depth3Categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 주소 및 위치 정보 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>주소 *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="주소를 입력하세요" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                handleAddressChange(e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel>지역 *</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {cities.map((city) => (
                        <Button
                          key={city.id}
                          type="button"
                          variant={selectedRegion === city.name ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handleRegionSelect(city.id, city.name)}
                        >
                          {city.name}
                        </Button>
                      ))}
                    </div>
                    {form.formState.errors.region && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {form.formState.errors.region.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>위도 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.00000001"  // 8자리 소수점 허용
                            placeholder="예: 37.5665" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>경도 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.00000001"  // 8자리 소수점 허용
                            placeholder="예: 126.9780" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="google_map_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구글 Map URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="구글 지도 공유 URL을 입력하세요" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        구글 지도에서 위치를 검색하고 공유 URL을 붙여넣으세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 진료시간 - autosize 적용 */}
              <FormField
                control={form.control}
                name="business_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>진료시간</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="진료시간을 입력하세요" 
                        {...field}
                        className="min-h-[80px] resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 연락처 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>웹사이트</FormLabel>
                      <FormControl>
                        <Input placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>페이스북</FormLabel>
                      <FormControl>
                        <Input placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zalo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>잘로 ID</FormLabel>
                      <FormControl>
                        <Input placeholder="잘로 ID를 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호 *</FormLabel>
                      <FormControl>
                        <Input placeholder="전화번호를 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일 *</FormLabel>
                      <FormControl>
                        <Input placeholder="이메일을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 상세 설명 에디터 */}
              <FormField
                control={form.control}
                name="detail_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상세 설명</FormLabel>
                    <FormControl>
                      <TiptapEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
