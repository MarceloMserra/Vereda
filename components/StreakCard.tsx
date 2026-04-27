'use client'

interface StreakCardProps {
  streak: number
  total: number
  totalDias: number
}

export default function StreakCard({ streak, total, totalDias }: StreakCardProps) {
  const porcentagem = Math.round((total / totalDias) * 100)

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30">
          <span className="text-2xl font-bold text-gold-400">{streak}</span>
          <span className="text-[10px] text-gold-600 uppercase tracking-wider">dias</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-200">
            {streak === 0 ? 'Comece hoje!' : streak === 1 ? '1 dia seguido' : `${streak} dias seguidos`}
          </p>
          <p className="text-xs text-vereda-muted mt-0.5">
            {total} de {totalDias} dias lidos
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 min-w-[60px]">
        <span className="text-xs text-gold-400 font-medium">{porcentagem}%</span>
        <div className="w-14 h-1.5 bg-vereda-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>
    </div>
  )
}
