import { supabase } from '@/lib/supabase'
import { TreatmentDetail } from '@/types/treatment'

export interface Treatment {
  id: number
  hospital_id: number
  hospital_name: string
  hospital_phone: string
  hospital_facebook_url: string
  hospital_zalo_id: string
  title: string
  summary: string
  city_id: number
  city_name: string
  rating: number
  comment_count: number
  view_count: number
  like_count: number
  thumbnail_url: string
  detail_content: string
  is_advertised: boolean
  is_recommended: boolean
  is_discounted: boolean
  price: number
  discount_price: number
  discount_rate: number
  categories: {
    depth2_id: number
    depth2_name: string
    depth3_list: Array<{
      id: number
      name: string
    }>
  }[]
  created_at: string
  updated_at: string
}

export interface TreatmentListResponse {
  data: Treatment[]
  total_count: number
  has_next: boolean
}

export interface TreatmentListParams {
  hospital_id?: number
  depth2_category_id?: number
  depth3_category_id?: number
  is_advertised?: boolean
  is_recommended?: boolean
  city_id?: number
  is_discounted?: boolean
  price_from?: number
  price_to?: number
  sort_by?: 'view_count' | 'like_count' | 'rating' | 'discount_price_asc' | 'discount_price_desc'
  limit?: number
  offset?: number
}

export interface GetTreatmentsParams {
  hospital_id?: number
  depth2_category_id?: number
  depth3_category_id?: number
  is_advertised?: boolean
  is_recommended?: boolean
  city_id?: number
  is_discounted?: boolean
  price_from?: number
  price_to?: number
  sort_by?: 'view_count' | 'like_count' | 'rating' | 'discount_price_asc' | 'discount_price_desc'
  limit?: number
  offset?: number
  searchTerm?: string
}

export async function getTreatments(params: GetTreatmentsParams): Promise<TreatmentListResponse> {
  console.log('[getTreatments] Input params:', params);

  const rpcResponse = await supabase.rpc('get_treatments', {
    p_hospital_id: params.hospital_id,
    p_depth2_category_id: params.depth2_category_id,
    p_depth3_category_id: params.depth3_category_id,
    p_is_advertised: params.is_advertised,
    p_is_recommended: params.is_recommended,
    p_city_id: params.city_id,
    p_is_discounted: params.is_discounted,
    p_price_from: params.price_from,
    p_price_to: params.price_to,
    p_sort_by: params.sort_by || 'view_count',
    p_limit: params.limit || 10,
    p_offset: params.offset || 0,
    p_search_term: params.searchTerm
  })

  console.log('[getTreatments] RPC raw response:', rpcResponse);

  const { data, error } = rpcResponse;

  if (error) {
    console.error('[getTreatments] Error:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log('[getTreatments] No data found');
    return {
      data: [],
      total_count: 0,
      has_next: false
    };
  }

  const result = {
    data,
    total_count: data[0].total_count,
    has_next: data[0].has_next
  };

  console.log('[getTreatments] Final result:', result);

  return result;
}

export async function getTreatmentDetail(id: number): Promise<TreatmentDetail> {
  const { data, error } = await supabase
    .rpc('get_treatment_detail', {
      p_treatment_id: id
    })

  if (error) throw error
  if (!data || data.length === 0) throw new Error('Treatment not found')
  
  return data[0]
}

interface CreateTreatmentData {
  hospital_id: number
  city_id: number
  name: string
  thumbnail_url: string
  description: string
  detail_content: string
  is_advertised: boolean
  is_recommended: boolean
  is_discounted: boolean
  discount_rate: number | null
  discounted_price: number
  original_price: number
}

interface CategoryData {
  depth2_category_id: number
  depth3_category_id: number
}

export const TreatmentService = {
  async create(treatmentData: CreateTreatmentData, categories: CategoryData[]) {
    try {
      console.log('Creating treatment with data:', treatmentData)
      console.log('Categories:', categories)

      if (!treatmentData.hospital_id) {
        return {
          success: false,
          error: '병원을 선택해주세요'
        }
      }

      if (!treatmentData.city_id) {
        console.error('No city_id provided:', treatmentData)
        return {
          success: false,
          error: '도시 정보가 없습니다'
        }
      }

      if (categories.length === 0) {
        return {
          success: false,
          error: '최소 1개의 카테고리를 선택해주세요'
        }
      }

      const rpcParams = {
        p_hospital_id: treatmentData.hospital_id,
        p_city_id: treatmentData.city_id,
        p_name: treatmentData.name,
        p_thumbnail_url: treatmentData.thumbnail_url,
        p_description: treatmentData.description,
        p_detail_content: treatmentData.detail_content,
        p_is_advertised: treatmentData.is_advertised,
        p_is_recommended: treatmentData.is_recommended,
        p_is_discounted: treatmentData.is_discounted,
        p_discount_rate: treatmentData.discount_rate,
        p_discounted_price: treatmentData.discounted_price,
        p_original_price: treatmentData.original_price,
        p_categories: categories
      }

      console.log('Sending RPC params:', rpcParams)

      const { data, error } = await supabase.rpc('admin_create_treatment', rpcParams)

      console.log('RPC response:', { data, error })

      if (error) {
        console.error('Supabase RPC error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      if (!data) {
        console.error('No data returned from RPC')
        return {
          success: false,
          error: 'RPC 응답이 없습니다'
        }
      }

      if (data.error) {
        console.error('RPC execution error:', data.error)
        return {
          success: false,
          error: data.error
        }
      }

      if (!data.treatment_id) {
        console.error('No treatment_id in response')
        return {
          success: false,
          error: '시술 ID를 받지 못했습니다'
        }
      }

      return {
        success: true,
        treatment_id: data.treatment_id
      }
    } catch (error) {
      console.error('Error in create treatment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '시술 등록 중 오류가 발생했습니다'
      }
    }
  },

  async getTreatments({
    hospital_id,
    depth2_category_id,
    depth3_category_id,
    is_advertised,
    is_recommended,
    city_id,
    is_discounted,
    price_from,
    price_to,
    sort_by,
    limit,
    offset,
    searchTerm
  }: GetTreatmentsParams = {}) {
    const { data, error } = await supabase
      .rpc('get_treatments', {
        p_hospital_id: hospital_id,
        p_depth2_category_id: depth2_category_id,
        p_depth3_category_id: depth3_category_id,
        p_is_advertised: is_advertised,
        p_is_recommended: is_recommended,
        p_city_id: city_id,
        p_is_discounted: is_discounted,
        p_price_from: price_from,
        p_price_to: price_to,
        p_sort_by: sort_by || 'view_count',
        p_limit: limit || 10,
        p_offset: offset || 0,
        p_search_term: searchTerm
      })

    if (error) throw error
    return data
  }
} 