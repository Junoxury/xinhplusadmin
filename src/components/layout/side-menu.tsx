"use client"

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Building2,
  Stethoscope,
  MessageSquare,
  MessageCircle,
  LayoutGrid,
  Globe,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const menuItems = [
  {
    title: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: '회원관리',
    href: '/members',
    icon: Users
  },
  {
    title: '병원관리',
    href: '/hospitals',
    icon: Building2
  },
  {
    title: '시술관리',
    href: '/procedures',
    icon: Stethoscope
  },
  {
    title: '리뷰관리',
    href: '/reviews',
    icon: MessageSquare
  },
  {
    title: '댓글관리',
    href: '/comments',
    icon: MessageCircle
  },
  {
    title: '마케팅 관리',
    href: '/marketing',
    icon: LayoutGrid,
    subItems: [
      {
        title: '배너관리',
        href: '/marketing/banners',
      },
      {
        title: '기획전관리',
        href: '/marketing/promotions',
      }
    ]
  },
  {
    title: '한국원정관리',
    href: '/korea-visits',
    icon: Globe
  },
  {
    title: '관리자관리',
    href: '/admins',
    icon: Users
  },
  {
    title: '설정',
    href: '/settings',
    icon: Settings,
    subItems: [
      {
        title: '카테고리 관리',
        href: '/settings/categories',
      },
      {
        title: '지역 관리',
        href: '/settings/regions',
      },
      {
        title: 'API 관리',
        href: '/settings/apis',
      }
    ]
  },
]

export function SideMenu() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "relative border-r bg-card",
      isCollapsed ? "w-16" : "w-64",
      "transition-all duration-300"
    )}>
      <div className="flex flex-col py-4 h-full">
        <div className="px-3 py-2">
          <h2 className={cn(
            "mb-2 px-4 text-lg font-semibold transition-all duration-300",
            isCollapsed && "opacity-0"
          )}>
            메뉴
          </h2>
          <div className="space-y-1">
            {menuItems.map((menu) => (
              <div key={menu.href}>
                <Link
                  href={menu.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === menu.href ? "bg-accent" : "transparent",
                    isCollapsed && "justify-center"
                  )}
                >
                  <menu.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && menu.title}
                </Link>
                {menu.subItems && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {menu.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === subItem.href ? "bg-accent" : "transparent"
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 접기/펼치기 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
} 