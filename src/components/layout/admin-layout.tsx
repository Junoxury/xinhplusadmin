"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SideMenu } from './side-menu'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-card transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* 로고 영역 */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className={cn('text-xl font-bold', isCollapsed ? 'hidden' : 'block')}>
            Xinh+
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        
        {/* 메뉴 영역 */}
        <SideMenu isCollapsed={isCollapsed} />
      </aside>

      {/* 메인 콘텐츠 */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 p-6',
          isCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  )
} 