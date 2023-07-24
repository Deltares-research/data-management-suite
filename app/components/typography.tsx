export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  )
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>
}
