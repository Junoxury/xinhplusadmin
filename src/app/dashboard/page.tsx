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

// 차트 데이터
const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}일`,
  users: Math.floor(Math.random() * 100) + 50,
  hospitals: Math.floor(Math.random() * 20) + 5,
  reviews: Math.floor(Math.random() * 50) + 20,
  comments: Math.floor(Math.random() * 80) + 30,
}))

// 카드 헤더 컴포넌트
function CardMenuHeader({ title }: { title: string }) {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>다운로드</DropdownMenuItem>
          <DropdownMenuItem>상세보기</DropdownMenuItem>
          <DropdownMenuItem>공유하기</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
  )
}

// 차트 컴포넌트
function ChartCard({ title, dataKey, color }: { title: string; dataKey: string; color: string }) {
  return (
    <Card>
      <CardMenuHeader title={title} />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
  value: string
  increase: number
  icon: React.ReactNode
}

function StatCard({ title, value, increase, icon }: StatCardProps) {
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
              <DropdownMenuItem>다운로드</DropdownMenuItem>
              <DropdownMenuItem>상세보기</DropdownMenuItem>
              <DropdownMenuItem>공유하기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{value}</h3>
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
        <div className="flex justify-end">
          <DateRangePicker />
        </div>
      </div>

      {/* 통계 카드 영역 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 가입자"
          value="1,234"
          increase={12.5}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="병원/클리닉"
          value="89"
          increase={5.2}
          icon={<Building2 className="h-6 w-6" />}
        />
        <StatCard
          title="성형/시술"
          value="456"
          increase={8.7}
          icon={<Stethoscope className="h-6 w-6" />}
        />
        <StatCard
          title="후기"
          value="789"
          increase={15.3}
          icon={<MessageSquare className="h-6 w-6" />}
        />
      </div>

      {/* 차트 영역 */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="일별 가입자 현황" dataKey="users" color="#7C3AED" />
        <ChartCard title="일별 병원 가입 현황" dataKey="hospitals" color="#EC4899" />
        <ChartCard title="일별 후기 현황" dataKey="reviews" color="#60A5FA" />
        <ChartCard title="일별 댓글 현황" dataKey="comments" color="#34D399" />
      </div>
    </div>
  )
} 