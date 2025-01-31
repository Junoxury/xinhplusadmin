import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type City = Tables['cities']

export const RegionService = {
  async getAll(orderBy: 'name' | 'sort_order' = 'sort_order') {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order(orderBy === 'name' ? 'name' : 'sort_order')

    if (error) throw error
    return data
  },

  async update(id: number, city: Partial<City>) {
    const { data, error } = await supabase
      .from('cities')
      .update(city)
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