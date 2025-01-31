import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
} 