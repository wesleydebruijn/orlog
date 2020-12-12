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

export function GameTopbar({ title }: { title: string }) {
  return (
    <div className="md:w-full bg-primary border-t-8 border-b-8 border-secondary h-16">
      <div className="md:container md:mx-auto flex items-center h-full justify-center relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="380"
          height="100"
          viewBox="0 0 129.278 29.336"
        >
          <path
            d="M22.375,14.419H151.653L134.748,43.756H39.778l-17.4-29.336"
            transform="translate(-22.375 -14.419)"
            fill="#211c1c"
            strokeWidth="2"
            stroke="#403535"
          />
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            className="text-orange font-signika"
            style={{
              fontSize: '0.35rem'
            }}
            fill="orange"
          >
            {title}
          </text>
        </svg>
      </div>
    </div>
  )
}
