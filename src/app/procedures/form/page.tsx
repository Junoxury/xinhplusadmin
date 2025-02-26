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
import { HospitalSearch } from '@/components/common/hospital-search'
import { TreatmentService } from '@/services/treatments'

const formSchema = z.object({
  hospital_id: z.number({
    required_error: '병원을 선택해주세요',
    invalid_type_error: '병원을 선택해주세요',
  }),
  city_id: z.number({
    required_error: '도시 정보가 필요합니다',
    invalid_type_error: '도시 정보가 올바르지 않습니다',
  }),
  hospital_name: z.string().optional(),
  procedure_name: z.string().min(2, '시술명을 입력해주세요'),
  thumbnail_url: z.string().min(1, '썸네일 이미지를 업로드해주세요'),
  description: z.string().min(10, '간단 설명을 10자 이상 입력해주세요'),
  detail_content: z.string().min(1, '상세 설명을 입력해주세요'),
  is_advertised: z.boolean().default(false),
  is_recommended: z.boolean().default(false),
  is_discounted: z.boolean().default(false),
  discount_rate: z.string().optional(),
  discounted_price: z.string().optional(),
  original_price: z.string().optional(),
  categories: z.array(z.object({
    depth2: z.string(),
    depth3: z.array(z.string())
  })).min(1, '최소 1개의 카테고리를 선택해주세요'),
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

// 가격 계산 함수들 추가
const calculateDiscountRate = (original: number, discounted: number): number => {
  return Math.round(((original - discounted) / original) * 100)
}

const calculateDiscountedPrice = (original: number, rate: number): number => {
  return Math.round(original * (1 - rate / 100))
}

const calculateOriginalPrice = (discounted: number, rate: number): number => {
  return Math.round(discounted / (1 - rate / 100))
}

export default function HospitalForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_advertised: false,
      is_recommended: false,
      is_discounted: true,
      categories: [],
      hospital_id: undefined,
      city_id: undefined,
      hospital_name: '',
      procedure_name: '',
      thumbnail_url: '',
      description: '',
      detail_content: '',
      discount_rate: '',
      discounted_price: '',
      original_price: '',
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

  // 가격 동기화 처리를 위한 함수 수정
  const handlePriceChange = (type: 'original' | 'discounted', value: string) => {
    const isDiscounted = form.getValues('is_discounted')
    
    if (!isDiscounted) {
      // 할인이 비활성화된 경우 두 가격을 동일하게 설정
      form.setValue('original_price', value)
      form.setValue('discounted_price', value)
      form.setValue('discount_rate', '')
      return
    }

    // 할인이 활성화된 경우
    const originalPrice = type === 'original' ? parseFloat(value) : parseFloat(form.getValues('original_price') || '0')
    const discountedPrice = type === 'discounted' ? parseFloat(value) : parseFloat(form.getValues('discounted_price') || '0')
    const discountRate = parseFloat(form.getValues('discount_rate') || '0')

    if (type === 'original' && value && discountRate) {
      // 원래가격과 할인율로 최종가격 계산
      const calculated = calculateDiscountedPrice(originalPrice, discountRate)
      form.setValue('discounted_price', calculated.toString())
    } else if (type === 'original' && value && discountedPrice) {
      // 원래가격과 최종가격으로 할인율 계산
      const calculated = calculateDiscountRate(originalPrice, discountedPrice)
      form.setValue('discount_rate', calculated.toString())
    } else if (type === 'discounted' && value && originalPrice) {
      // 최종가격과 원래가격으로 할인율 계산
      const calculated = calculateDiscountRate(originalPrice, discountedPrice)
      form.setValue('discount_rate', calculated.toString())
    }

    form.setValue(type === 'original' ? 'original_price' : 'discounted_price', value)
  }

  // 할인율 변경 처리 함수 추가
  const handleDiscountRateChange = (value: string) => {
    if (!value) {
      form.setValue('discount_rate', '')
      return
    }

    const rate = parseFloat(value)
    if (rate >= 0 && rate <= 100) {
      form.setValue('discount_rate', value)
      
      const originalPrice = parseFloat(form.getValues('original_price') || '0')
      if (originalPrice) {
        // 원래가격과 할인율로 최종가격 계산
        const calculated = calculateDiscountedPrice(originalPrice, rate)
        form.setValue('discounted_price', calculated.toString())
      } else {
        const discountedPrice = parseFloat(form.getValues('discounted_price') || '0')
        if (discountedPrice) {
          // 최종가격과 할인율로 원래가격 계산
          const calculated = calculateOriginalPrice(discountedPrice, rate)
          form.setValue('original_price', calculated.toString())
        }
      }
    }
  }

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
    form.setValue('city_id', cityId)
  }

  // 주소 입력 시 지역 자동 선택 처리
  const handleAddressChange = (value: string) => {
    const region = regions.find(r => value.includes(r))
    if (region) {
      setSelectedRegion(region)
      const city = cities.find(c => c.name === region)
      if (city) {
        form.setValue('city_id', city.id)
      }
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

  // handleDepth2Delete 함수 추가
  const handleDepth2Delete = (depth2ToDelete: string) => {
    const updatedCategories = selectedCategories.filter(cat => cat.depth2 !== depth2ToDelete)
    setSelectedCategories(updatedCategories)
    form.setValue('categories', updatedCategories)
    if (currentDepth2 === depth2ToDelete) {
      setCurrentDepth2('')
    }
  }

  // 폼 제출 함수 추가
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values)

    if (isSubmitting) {
      console.log('Already submitting, returning...')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Starting submission process...')

      if (!values.hospital_id) {
        toast.error('병원을 선택해주세요')
        return
      }

      // 카테고리 데이터 변환
      const categories = selectedCategories.flatMap(cat => {
        const depth2Category = depth2Categories.find(d2 => d2.name === cat.depth2)
        return cat.depth3.map(d3Name => {
          const depth3Category = allDepth3Categories.find(d3 => 
            d3.name === d3Name && 
            d3.parent_id === depth2Category?.id
          )
          // depth2_category_id와 depth3_category_id가 모두 정의된 경우에만 반환
          if (depth2Category?.id !== undefined && depth3Category?.id !== undefined) {
            return {
              depth2_category_id: depth2Category.id,
              depth3_category_id: depth3Category.id
            }
          }
          return null; // undefined인 경우 null 반환
        }).filter(cat => cat !== null) // null 필터링
      })

      if (categories.length === 0) {
        toast.error('최소 1개의 카테고리를 선택해주세요')
        return
      }

      console.log('Processed categories:', categories)

      // 시술 데이터 준비
      const treatmentData = {
        hospital_id: values.hospital_id,
        city_id: values.city_id,
        name: values.procedure_name,
        thumbnail_url: values.thumbnail_url,
        description: values.description,
        detail_content: values.detail_content,
        is_advertised: values.is_advertised,
        is_recommended: values.is_recommended,
        is_discounted: values.is_discounted,
        discount_rate: values.is_discounted ? parseInt(values.discount_rate || '0') : null,
        discounted_price: parseInt(values.discounted_price || '0'),
        original_price: parseInt(values.original_price || '0'),
      }

      console.log('Treatment data prepared:', treatmentData)

      // city_id 값 확인을 위한 추가 검증
      if (!values.city_id) {
        toast.error('도시 정보가 없습니다')
        return
      }

      // RPC 호출하여 저장
      const result = await TreatmentService.create(treatmentData, categories)
      console.log('RPC result:', result)

      if (result.success) {
        toast.success('시술이 성공적으로 등록되었습니다')
        await router.push('/procedures')
        return
      } else {
        toast.error(`시술 등록에 실패했습니다: ${result.error}`)
      }

    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error instanceof Error ? error.message : '시술 정보 저장에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>시술 정보 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={(e) => {
                console.log('Form submit event triggered') // 폼 제출 이벤트 로깅
                form.handleSubmit(onSubmit)(e)
              }} 
              className="space-y-8"
            >
              {/* 병원 검색 */}
              <FormField
                control={form.control}
                name="hospital_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>병원 검색 *</FormLabel>
                    <FormControl>
                      <HospitalSearch
                        value={field.value}
                        onSelect={(hospital) => {
                          console.log('Selected hospital:', hospital)  // 로그 추가
                          field.onChange(hospital.name)
                          form.setValue('hospital_id', hospital.id, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                          form.setValue('city_id', hospital.city_id || 0, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                          console.log('Form values after hospital select:', form.getValues())  // 로그 추가
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 시술명 */}
              <FormField
                control={form.control}
                name="procedure_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시술명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="시술명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 썸네일 이미지 업로드 필드 */}
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>썸네일 이미지 *</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onFileChange={(file) => handleThumbnailUpload(file)}
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

              {/* 간단 설명 - 썸네일 이미지 아래로 이동 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>간단 설명 *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="시술에 대한 간단한 설명을 입력하세요" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 옵션 설정 - 할인 카드를 맨 앞으로 이동 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="is_discounted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">할인</FormLabel>
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
              </div>

              {/* 가격 정보 - 할인율을 맨 오른쪽으로 이동 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="discounted_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>할인가격(최종가격)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="예: 1000000" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            if (!value || parseFloat(value) >= 0) {
                              handlePriceChange('discounted', value)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>원래 가격</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="예: 2000000" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            if (!value || parseFloat(value) >= 0) {
                              handlePriceChange('original', value)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>할인율 (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="예: 20" 
                          {...field}
                          disabled={!form.getValues('is_discounted')}
                          onChange={(e) => {
                            const value = e.target.value
                            handleDiscountRateChange(value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>0-100 사이의 숫자를 입력하세요</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{category.depth2}</div>
                              <button
                                type="button"
                                onClick={() => handleDepth2Delete(category.depth2)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                삭제
                              </button>
                            </div>
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
