import './Topbar.scss'

export function GameTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="topbar topbar--game">
      <svg xmlns="http://www.w3.org/2000/svg" width="380" height="80" viewBox="-5 0 145 30">
        <path
          d="M22.375,14.419H151.653L134.748,43.756H39.778l-17.4-29.336"
          transform="translate(-22.375 -14.419)"
          fill="#211c1c"
          strokeWidth="2"
          stroke="#403535"
        />
      </svg>
      <span className="topbar--game__title">{title}</span>
      {subtitle && <span className="topbar--game__subtitle">{subtitle}</span>}
    </div>
  )
}
