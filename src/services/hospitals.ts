import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type Hospital = Tables['hospitals']

export interface GetHospitalsParams {
  page: number
  pageSize: number
  sortBy: 'latest' | 'views' | 'rating' | 'likes'
  cityId?: number
  depth2TreatmentCategoryId?: number
  depth3TreatmentCategoryId?: number
  is_advertised?: boolean
  is_recommended?: boolean
  is_member?: boolean
  is_google?: boolean
  hasDiscount?: boolean
}

export const HospitalService = {
  async getAll() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(hospitalData: any, categories: any[]) {
    const { data, error } = await supabase
      .rpc('create_hospital', {
        p_hospital_data: hospitalData,
        p_categories: categories
      })

    if (error) throw error
    return data
  },

  async update(id: number, hospital: Partial<Hospital>) {
    const { data, error } = await supabase
      .from('hospitals')
      .update(hospital)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getHospitals({
    cityId,
    depth2TreatmentCategoryId,
    depth3TreatmentCategoryId,
    is_advertised,
    is_recommended,
    is_member,
    is_google,
    hasDiscount,
    page = 1,
    pageSize = 10,
    sortBy = 'latest'
  }: GetHospitalsParams = {}) {
    const { data, error } = await supabase
      .rpc('get_hospitals_list', {
        p_city_id: cityId,
        p_depth2_treatment_category_id: depth2TreatmentCategoryId,
        p_depth3_treatment_category_id: depth3TreatmentCategoryId,
        p_is_advertised: is_advertised,
        p_is_recommended: is_recommended,
        p_is_member: is_member,
        p_is_google: is_google,
        p_has_discount: hasDiscount,
        p_page: page,
        p_page_size: pageSize,
        p_sort_by: sortBy
      })

    if (error) throw error
    return data as Hospital[]
  },

  // 병원 상세 정보 조회
  async getHospitalDetail(id: number) {
    const { data, error } = await supabase
      .rpc('get_hospital_detail', { p_hospital_id: id })
    
    if (error) throw error
    return data[0]
  },

  // 병원 삭제 메서드 추가
  async deleteHospital(hospitalId: number) {
    const { error } = await supabase.rpc(
      'delete_hospital_with_categories',
      { p_hospital_id: hospitalId }
    )
    
    if (error) throw error
  }
} 