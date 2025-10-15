import React from 'react'
import clsx from 'clsx'

export default function DashboardCard({
  title,
  value,
  subtitle,
  color = 'blue',
  icon: Icon,
}: {
  title: string
  value: React.ReactNode
  subtitle?: string
  color?: 'blue' | 'green' | 'purple' | 'emerald' | 'violet'
  icon?: React.ComponentType<{ className?: string }>
}) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
  }

  const styles = colorMap[color] || colorMap.blue

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
      {Icon && (
        <div className={clsx('p-3 rounded-lg', styles.bg)}>
          <Icon className={clsx('w-6 h-6', styles.text)} />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={clsx('text-xl font-bold', styles.text)}>{value}</div>
        </div>
        {subtitle && <p className="mt-2 text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}
