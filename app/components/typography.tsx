import { cn } from '~/utils'

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-5xl font-semibold tracking-tight">
      {children}
    </h1>
  )
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'croll-m-20 text-3xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  )
}

export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  )
}

export function Muted({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {children}
    </p>
  )
}

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>
}
