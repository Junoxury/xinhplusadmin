"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { 
  Users, Building2, Stethoscope, MessageSquare, MoreHorizontal, LayoutDashboard 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { addDays, startOfDay as startOfDayFns, endOfDay as endOfDayFns, subDays, subMonths, format } from "date-fns"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { dashboardService } from '@/services/dashboard'

// 차트 컴포넌트
function ChartCard({ title, dataKey, color, detailLink, data }: { 
  title: string; 
  dataKey: string; 
  color: string;
  detailLink: string;
  data: any[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(detailLink)}>
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-muted-foreground">
              다운로드
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#382F66" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#251B4A',
                borderColor: '#382F66' 
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  title: string
  total: number
  period: number
  increase: number
  icon: React.ReactNode
  detailLink: string
}

function StatCard({ title, total, period, increase, icon, detailLink }: StatCardProps) {
  const router = useRouter()
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(detailLink)}>
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="text-muted-foreground">
                다운로드
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold">
                  {total.toLocaleString()}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({period.toLocaleString()})
                </span>
              </div>
              <p className={cn(
                "text-sm",
                increase > 0 ? "text-green-500" : "text-red-500"
              )}>
                {increase > 0 ? "+" : ""}{increase}%
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  // 초기 날짜 범위를 일주일로 설정
  const today = new Date()
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDayFns(subDays(today, 6)), // 6일 전부터
    to: endOfDayFns(today) // 오늘까지
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('week') // 초기값을 'week'로 설정
  const [stats, setStats] = useState({ userCount: { total: 0, period: 0 }, hospitalCount: { total: 0, period: 0 }, treatmentCount: { total: 0, period: 0 }, reviewCount: { total: 0, period: 0 } })
  const [chartData, setChartData] = useState<any[]>([])

  // 통계 데이터 로드
  useEffect(() => {
    if (date?.from && date?.to) {
      dashboardService.getStats(date.from, date.to).then(setStats)
    }
  }, [date])

  // 차트 데이터 로드
  useEffect(() => {
    if (date?.from && date?.to) {
      dashboardService.getChartData(date.from, date.to).then(setChartData)
    }
  }, [date])

  const handleDateSelect = (period: 'today' | 'week' | 'month') => {
    setSelectedPeriod(period)
    const today = new Date()
    let newRange: DateRange = {
      from: startOfDayFns(today),
      to: endOfDayFns(today)
    }

    switch (period) {
      case 'today':
        // 이미 위에서 설정됨
        break
      case 'week':
        newRange = {
          from: startOfDayFns(subDays(today, 6)),
          to: endOfDayFns(today)
        }
        break
      case 'month':
        newRange = {
          from: startOfDayFns(subMonths(today, 1)),
          to: endOfDayFns(today)
        }
        break
    }

    setDate(newRange)
  }

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">대시보드</h1>
            <p className="text-sm text-muted-foreground">
              서비스 현황을 한눈에 파악하세요
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateSelect('today')}
            >
              오늘
            </Button>
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateSelect('week')}
            >
              일주일
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateSelect('month')}
            >
              한달
            </Button>
            <DateRangePicker 
              date={date} 
              onDateChange={(newDate) => {
                setDate(newDate);
                setSelectedPeriod('custom');
              }}
              selected={selectedPeriod === 'custom'}
            />
          </div>
        </div>
      </div>

      {/* 통계 카드 영역 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 가입자"
          total={stats.userCount.total}
          period={stats.userCount.period}
          increase={12.5}
          icon={<Users className="h-6 w-6" />}
          detailLink="/members"
        />
        <StatCard
          title="병원/클리닉"
          total={stats.hospitalCount.total}
          period={stats.hospitalCount.period}
          increase={5.2}
          icon={<Building2 className="h-6 w-6" />}
          detailLink="/hospitals"
        />
        <StatCard
          title="성형/시술"
          total={stats.treatmentCount.total}
          period={stats.treatmentCount.period}
          increase={8.7}
          icon={<Stethoscope className="h-6 w-6" />}
          detailLink="/procedures"
        />
        <StatCard
          title="후기"
          total={stats.reviewCount.total}
          period={stats.reviewCount.period}
          increase={15.3}
          icon={<MessageSquare className="h-6 w-6" />}
          detailLink="/reviews"
        />
      </div>

      {/* 차트 영역 */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard 
          title="일별 가입자 현황" 
          dataKey="users" 
          color="#7C3AED" 
          detailLink="/members"
          data={chartData}
        />
        <ChartCard 
          title="일별 병원 가입 현황" 
          dataKey="hospitals" 
          color="#EC4899" 
          detailLink="/hospitals"
          data={chartData}
        />
        <ChartCard 
          title="일별 성형/시술 등록 현황" 
          dataKey="surgeries" 
          color="#60A5FA" 
          detailLink="/procedures"
          data={chartData}
        />
        <ChartCard 
          title="일별 후기 현황" 
          dataKey="reviews" 
          color="#34D399" 
          detailLink="/reviews"
          data={chartData}
        />
      </div>
    </div>
  )
} 