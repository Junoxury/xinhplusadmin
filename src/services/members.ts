import { supabase } from '@/lib/supabase'

export interface Member {
  id: string
  email: string
  nickname: string
  gender: string
  age: number | null
  phone: string
  avatar_url: string | null
  provider: string
  last_sign_in_at: string
  city_name: string
  categories: string[]
}

export interface MemberListResponse {
  total_count: number
  data: Member[]
}

export interface MemberListParams {
  search_text?: string
  gender_filter?: string
  provider_filter?: string
  city_filter?: number
  category_filter?: number
  page_number: number
  items_per_page: number
}

export async function getMembersList(params: MemberListParams): Promise<MemberListResponse> {
  console.log('Calling RPC with params:', params);
  
  const { data, error } = await supabase.rpc('get_members_list', {
    search_text: params.search_text,
    gender_filter: params.gender_filter === 'all' ? null : params.gender_filter,
    provider_filter: params.provider_filter === 'all' ? null : params.provider_filter,
    city_filter: params.city_filter,
    category_filter: params.category_filter,
    page_number: params.page_number,
    items_per_page: params.items_per_page
  })
  
  if (error) {
    console.error('Supabase RPC error:', error);
    throw new Error(`Failed to fetch members: ${error.message}`);
  }
  
  console.log('Raw Supabase response:', data);
  
  if (!data || data.length === 0) {
    return { total_count: 0, data: [] }
  }

  const total_count = data[0].total_count
  const members = data.map(item => ({
    ...item,
    total_count: undefined
  })) as Member[]

  console.log('Processed response:', { total_count, members });

  return {
    total_count,
    data: members
  }
} 