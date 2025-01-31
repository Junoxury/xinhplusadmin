import { supabase } from '@/lib/supabase'

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

export async function getTreatments(params: TreatmentListParams): Promise<TreatmentListResponse> {
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
    p_offset: params.offset || 0
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