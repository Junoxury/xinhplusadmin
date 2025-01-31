import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type Hospital = Tables['hospitals']

export interface GetHospitalsParams {
  cityId?: number
  depth2BodyCategoryId?: number
  depth2TreatmentCategoryId?: number
  depth3BodyCategoryId?: number
  depth3TreatmentCategoryId?: number
  isAdvertised?: boolean
  isRecommended?: boolean
  isMember?: boolean
  hasDiscount?: boolean
  page?: number
  pageSize?: number
  sortBy?: 'latest' | 'views' | 'rating' | 'likes'
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

  async create(hospital: Omit<Hospital, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('hospitals')
      .insert(hospital)
      .select()
      .single()

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
    depth2BodyCategoryId,
    depth2TreatmentCategoryId,
    depth3BodyCategoryId,
    depth3TreatmentCategoryId,
    isAdvertised,
    isRecommended,
    isMember,
    hasDiscount,
    page = 1,
    pageSize = 10,
    sortBy = 'latest'
  }: GetHospitalsParams = {}) {
    const { data, error } = await supabase
      .rpc('get_hospitals_list', {
        p_city_id: cityId,
        p_depth2_body_category_id: depth2BodyCategoryId,
        p_depth2_treatment_category_id: depth2TreatmentCategoryId,
        p_depth3_body_category_id: depth3BodyCategoryId,
        p_depth3_treatment_category_id: depth3TreatmentCategoryId,
        p_is_advertised: isAdvertised,
        p_is_recommended: isRecommended,
        p_is_member: isMember,
        p_has_discount: hasDiscount,
        p_page: page,
        p_page_size: pageSize,
        p_sort_by: sortBy
      })

    if (error) throw error
    return data as Hospital[]
  }
} 