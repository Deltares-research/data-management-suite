import { Link } from '@remix-run/react'
import { cn } from '~/utils'
import { Button } from './ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 sticky top-12',
        className,
      )}
      {...props}
    >
      {items.map(item => (
        <Button
          asChild
          key={item.href}
          variant="ghost"
          className="text-left justify-start"
        >
          <Link to={item.href}>{item.title}</Link>
        </Button>
      ))}
    </nav>
  )
}
