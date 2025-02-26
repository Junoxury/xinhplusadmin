import { supabase } from '@/lib/supabase'

export interface City {
  id: number;
  name: string;
  name_ko?: string;
  name_vi?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const RegionService = {
  getAll: async (orderBy: string): Promise<City[]> => {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, name_ko, name_vi, sort_order, is_active, created_at, updated_at')
      .order(orderBy)
    
    if (error) throw error
    return data as City[]
  },

  async update(id: number, city: Partial<City>) {
    const { id: _, ...updateData } = city  // id 제외
    const { data, error } = await supabase
      .from('cities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name_ko')

    if (error) throw error
    return data
  }
}

export interface Region {
  id: number
  name: string
}

export async function getRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching regions:', error)
    throw error
  }

  return data || []
} 