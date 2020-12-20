import './Topbar.scss'

type Props = {
  children: React.ReactNode
}

export default function Topbar({ children }: Props) {
  return (
    <div className="topbar">
      <div className="topbar__container">{children}</div>
    </div>
  )
}
