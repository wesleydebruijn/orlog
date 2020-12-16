import Diamond from '../../../shared/Figures/Diamond'

export function GameButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex justify-end">
      <Diamond className="w-64 text-red-600 z-10">
        <span className="text-white z-10 text-large">{children}</span>
      </Diamond>
    </div>
  )
}
