import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type Hospital = Tables['hospitals']

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
  }
} 