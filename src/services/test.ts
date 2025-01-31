import { supabase } from '@/lib/supabase'

export const TestService = {
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('test_connection')
        .select('*')
        .limit(1)

      if (error) throw error
      
      console.log('Supabase 연결 성공:', data)
      return true
    } catch (error) {
      console.error('Supabase 연결 실패:', error)
      return false
    }
  }
} 