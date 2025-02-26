import { supabase } from '@/lib/supabase'
import { HospitalDetail } from '@/types/hospital'
import type { Tables, Database, Json } from '@/types/supabase'

export type Hospital = Tables<'hospitals'> & {
  city_name?: string;
  city_name_vi?: string;
  city_name_ko?: string;
}

export interface HospitalWithCount {
  id: number;
  hospital_name: string;
  address: string;
  description: string;
  thumbnail_url: string;
  business_hours: string;
  phone: string;
  website: string;
  is_advertised: boolean;
  is_recommended: boolean;
  is_member: boolean;
  is_google?: boolean;
  has_discount: boolean;
  view_count: number;
  like_count: number;
  average_rating: number;
  city_name: string;
  city_name_vi: string;
  city_name_ko: string;
  total_count: number;
}

export interface GetHospitalsParams {
  page?: number
  pageSize?: number
  sortBy?: 'latest' | 'views' | 'rating' | 'likes'
  cityId?: number
  depth2TreatmentCategoryId?: number
  depth3TreatmentCategoryId?: number
  is_advertised?: boolean
  is_recommended?: boolean
  is_member?: boolean
  is_google?: boolean
  hasDiscount?: boolean
  searchTerm?: string
}

interface CreateHospitalData {
  hospital_name: string;
  city_id: number;
  business_hours: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  facebook_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  google_map_url?: string;
  // 필요한 다른 필드들도 추가
}

interface CreateHospitalCategory {
  depth2_category_id: number;
  depth3_category_id: number;
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

  async create(data: CreateHospitalData, categories: CreateHospitalCategory[]) {
    try {
      const { data: result, error } = await supabase
        .rpc('create_hospital', {
          p_hospital_data: {
            name: data.hospital_name,
            city_id: data.city_id,
            address: data.address,
            // ... 다른 필드들
          },
          p_categories: categories.map(cat => ({ category_id: cat.depth2_category_id }))
        });

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating hospital:', error);
      return { success: false, error };
    }
  },

  async update(id: number, hospital: Omit<Partial<Hospital>, 'id'>) {
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

  async getHospitals(params: GetHospitalsParams = {}) {
    const { data, error } = await supabase
      .rpc('get_hospitals_list', {
        p_city_id: params.cityId,
        p_depth2_treatment_category_id: params.depth2TreatmentCategoryId,
        p_depth3_treatment_category_id: params.depth3TreatmentCategoryId,
        p_is_advertised: params.is_advertised,
        p_is_recommended: params.is_recommended,
        p_is_member: params.is_member,
        p_is_google: params.is_google,
        p_has_discount: params.hasDiscount,
        p_page: params.page,
        p_page_size: params.pageSize,
        p_sort_by: params.sortBy,
        p_search_term: params.searchTerm
      })

    if (error) throw error
    return data as HospitalWithCount[]
  },

  // 병원 상세 정보 조회
  async getHospitalDetail(id: number) {
    const { data, error } = await supabase
      .rpc('get_hospital_detail', { p_hospital_id: id })
    
    if (error) throw error
    return data[0] as HospitalDetail
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