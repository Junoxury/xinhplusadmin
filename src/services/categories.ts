import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  depth: number;
  sort_order?: number;
  icon_path: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface GetAllParams {
  depth1Id?: number
  depth2Id?: number
}

interface TreatmentCategory {
  id: number;
  name: string;
  depth2_category_id: number | null;
  depth3_category_id: number | null;
  treatment_id: number | null;
  created_at: string | null;
  parent_id: number | null;
}

export const CategoryService = {
  // depth1 카테고리 목록 조회
  async getDepth1Categories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('depth', 1)
      .order('sort_order')

    if (error) throw error
    return data
  },

  // depth2 카테고리 목록 조회 (부위와 시술 순서로 정렬)
  async getDepth2Categories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('depth', 2)
      .order('sort_order')
    
    if (error) throw error
    return data
  },

  // depth3 카테고리 목록 조회
  async getDepth3Categories(parentId: number): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('depth', 3)
      .eq('parent_id', parentId)
      .order('sort_order')
    
    if (error) throw error
    return data
  },

  // 필터링된 전체 목록 조회
  async getAll(params: GetAllParams = {}) {
    const { depth1Id, depth2Id } = params
    
    let query = supabase
      .from('categories')
      .select('*')

    if (depth1Id) {
      // depth1 선택시: depth1과 그 하위 카테고리들 조회
      const depth2Query = supabase
        .from('categories')
        .select('id')
        .eq('parent_id', depth1Id)
        .order('sort_order')

      const { data: depth2Ids } = await depth2Query
      
      if (depth2Ids && depth2Ids.length > 0) {
        const depth2IdList = depth2Ids.map(d => d.id)
        query = query.or(
          `id.eq.${depth1Id},` + // depth1
          `parent_id.eq.${depth1Id},` + // depth2
          `parent_id.in.(${depth2IdList.join(',')})` // depth3
        )
      } else {
        query = query.or(
          `id.eq.${depth1Id},` +
          `parent_id.eq.${depth1Id}`
        )
      }
    } else if (depth2Id) {
      query = query.or(
        `id.eq.${depth2Id},` +
        `parent_id.eq.${depth2Id}`
      )
    }
    // depth1Id와 depth2Id가 모두 없는 경우 (전체 조회)
    // 아무 조건도 추가하지 않음

    const { data, error } = await query
    if (error) throw error

    // 계층 구조로 정렬
    return data?.sort((a, b) => {
      // 먼저 depth로 정렬
      if (a.depth !== b.depth) {
        return a.depth - b.depth
      }

      // 같은 depth 내에서는
      if (a.depth === 1) {
        // depth1은 sort_order로 정렬
        return a.sort_order - b.sort_order
      }

      if (a.depth === 2) {
        // depth2는 먼저 부모(depth1)의 sort_order로 정렬하고
        const aParent = data.find(c => c.id === a.parent_id)
        const bParent = data.find(c => c.id === b.parent_id)
        
        if (aParent && bParent && aParent.id !== bParent.id) {
          return aParent.sort_order - bParent.sort_order
        }
        // 같은 부모면 자신의 sort_order로 정렬
        return a.sort_order - b.sort_order
      }

      if (a.depth === 3) {
        // depth3는 먼저 부모(depth2)의 sort_order로 정렬하고
        const aParent = data.find(c => c.id === a.parent_id)
        const bParent = data.find(c => c.id === b.parent_id)
        
        if (aParent && bParent && aParent.id !== bParent.id) {
          return aParent.sort_order - bParent.sort_order
        }
        // 같은 부모면 자신의 sort_order로 정렬
        return a.sort_order - b.sort_order
      }

      return 0
    })
  },

  async update(id: number, category: Omit<Partial<Category>, 'id'>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getAllDepth3Categories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('depth', 3)
      .order('sort_order')

    if (error) throw error
    return data
  }
} 