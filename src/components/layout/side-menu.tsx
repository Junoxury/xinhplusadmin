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
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard />, label: '대시보드', href: '/dashboard' },
  { icon: <Building2 />, label: '병원관리', href: '/hospitals' },
  { icon: <Stethoscope />, label: '시술관리', href: '/procedures' },
  { icon: <MessageSquare />, label: '리뷰관리', href: '/reviews' },
  { icon: <MessageCircle />, label: '댓글관리', href: '/comments' },
  { icon: <LayoutGrid />, label: '마케팅 관리', href: '/marketing' },
  { icon: <Globe />, label: '한국원정관리', href: '/korea-visits' },
  { icon: <Users />, label: '관리자관리', href: '/admins' },
  { icon: <Settings />, label: '설정', href: '/settings' },
]

export function SideMenu({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
            isCollapsed ? 'justify-center' : 'justify-start gap-3'
          )}
        >
          {item.icon}
          {!isCollapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  )
} 