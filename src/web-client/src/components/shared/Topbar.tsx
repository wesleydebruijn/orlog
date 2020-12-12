type Props = {
  children: React.ReactNode
}

export default function Topbar({ children }: Props) {
  return (
    <div className="md:w-full bg-primary border-t-8 border-b-8 border-secondary h-24">
      <div className="md:container md:mx-auto flex items-center h-full justify-between">
        {children}
      </div>
    </div>
  )
}
