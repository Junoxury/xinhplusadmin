import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface DashboardStats {
  userCount: {
    total: number
    period: number
  }
  hospitalCount: {
    total: number
    period: number
  }
  treatmentCount: {
    total: number
    period: number
  }
  reviewCount: {
    total: number
    period: number
  }
}

export interface ChartData {
  date: string
  users: number
  hospitals: number
  surgeries: number
  reviews: number
}

export const dashboardService = {
  // 전체 통계 데이터 조회
  async getStats(from: Date, to: Date): Promise<DashboardStats> {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      start_date: from.toISOString(),
      end_date: to.toISOString()
    })
    
    if (error) throw error
    return data
  },

  // 차트 데이터 조회
  async getChartData(from: Date, to: Date): Promise<ChartData[]> {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.rpc('get_dashboard_chart_data', {
      start_date: from.toISOString(),
      end_date: to.toISOString()
    })
    
    if (error) throw error
    return data
  }
} 