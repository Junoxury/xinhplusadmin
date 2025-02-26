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
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import React from 'react'

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
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
    disabled: true,
    subItems: [
      {
        title: '배너관리',
        href: '/marketing/banners',
        icon: LayoutDashboard,
      },
      {
        title: '기획전관리',
        href: '/marketing/promotions',
        icon: LayoutDashboard,
      }
    ]
  },
  {
    title: '한국원정관리',
    href: '/korea-visits',
    icon: Globe,
    disabled: true
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
        icon: LayoutDashboard,
      },
      {
        title: '지역 관리',
        href: '/settings/regions',
        icon: LayoutDashboard,
      },
      {
        title: 'API 관리',
        href: '/settings/apis',
        disabled: true,
        icon: LayoutDashboard,
      }
    ]
  },
]

interface SideMenuProps {
  isCollapsed: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isCollapsed }) => {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [collapsed, setIsCollapsed] = useState(isCollapsed)

  const renderMenuItem = (menu: MenuItem) => {
    // 하위 메뉴가 있고 접혀있는 경우
    if (menu.subItems && collapsed) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
                pathname.startsWith(menu.href) ? "bg-accent" : "transparent",
                menu.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <menu.icon className="h-4 w-4" />
            </div>
          </PopoverTrigger>
          {!menu.disabled && (
            <PopoverContent side="right" className="p-0 w-40">
              <div className="space-y-1 p-1">
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
            </PopoverContent>
          )}
        </Popover>
      )
    }

    // 하위 메뉴가 있고 펼쳐진 경우
    if (menu.subItems && !collapsed) {
      return (
        <>
          <div
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname.startsWith(menu.href) ? "bg-accent" : "transparent",
              menu.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <menu.icon className="h-4 w-4 mr-2" />
            <span className="flex-1">{menu.title}</span>
            {menu.disabled && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                준비중
              </span>
            )}
          </div>
          {!menu.disabled && (
            <div className="ml-6 mt-1 space-y-1">
              {menu.subItems.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.disabled ? "#" : subItem.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === subItem.href ? "bg-accent" : "transparent",
                    subItem.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                  onClick={e => subItem.disabled && e.preventDefault()}
                >
                  <span className="flex-1">{subItem.title}</span>
                  {subItem.disabled && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      준비중
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )
    }

    // 일반 메뉴인 경우
    if (menu.disabled) {
      return (
        <div
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium opacity-50 cursor-not-allowed",
            collapsed && "justify-center"
          )}
        >
          <menu.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && (
            <>
              <span className="flex-1">{menu.title}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                준비중
              </span>
            </>
          )}
        </div>
      )
    }

    return (
      <Link
        href={menu.href}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === menu.href ? "bg-accent" : "transparent",
          collapsed && "justify-center"
        )}
      >
        <menu.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
        {!collapsed && menu.title}
      </Link>
    )
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('로그아웃되었습니다')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다')
    }
  }

  return (
    <div className={cn(
      "relative border-r bg-card",
      collapsed ? "w-16" : "w-64",
      "transition-all duration-300"
    )}>
      <div className="flex flex-col py-4 h-full">
        <div className="px-3 py-2">
          <div className={cn(
            "mb-6 px-4 flex items-center",
            collapsed && "justify-center"
          )}>
            <span className={cn(
              "text-2xl font-bold text-primary transition-all duration-300",
              collapsed && "text-lg"
            )}>
              Xinh+
            </span>
          </div>
          <div className="space-y-1">
            {menuItems.map((menu) => (
              <div key={menu.href}>
                {renderMenuItem(menu)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto px-3 py-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && "로그아웃"}
          </Button>
        </div>
      </div>

      {/* 접기/펼치기 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
} 