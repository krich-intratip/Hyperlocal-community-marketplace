'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useT } from '@/hooks/useT'

export interface FoodMenuItem {
  id: string
  name: string
  price: number
  stock: number
  maxStock: number
  emoji?: string
}

interface FoodStockProps {
  menus: FoodMenuItem[]
  onSelect?: (id: string) => void
  selectedIds?: string[]
}

export function FoodStockPanel({ menus, onSelect, selectedIds = [] }: FoodStockProps) {
  const t = useT()

  function stockColor(stock: number, max: number) {
    const ratio = stock / max
    if (stock === 0) return { bar: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-400', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200' }
    if (ratio <= 0.2) return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200' }
    if (ratio <= 0.5) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200' }
    return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200' }
  }

  function stockIcon(stock: number, max: number) {
    if (stock === 0) return <XCircle className="h-3.5 w-3.5 text-slate-400" />
    if (stock / max <= 0.2) return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
    return <CheckCircle className="h-3.5 w-3.5 text-green-500" />
  }

  return (
    <div className="space-y-3">
      {menus.map((menu) => {
        const colors = stockColor(menu.stock, menu.maxStock)
        const isSelected = selectedIds.includes(menu.id)
        const soldOut = menu.stock === 0

        return (
          <motion.div
            key={menu.id}
            whileHover={!soldOut ? { scale: 1.01, y: -1 } : {}}
            onClick={() => !soldOut && onSelect?.(menu.id)}
            className={`p-4 rounded-xl border transition-all ${
              soldOut
                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : isSelected
                  ? 'cursor-pointer bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 shadow-sm'
                  : 'cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                {menu.emoji && <span className="text-xl">{menu.emoji}</span>}
                <div>
                  <p className="font-semibold text-base text-slate-800 dark:text-slate-100">{menu.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">฿{menu.price} / จาน</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-bold ${colors.badge}`}>
                {stockIcon(menu.stock, menu.maxStock)}
                {soldOut ? 'หมดแล้ว' : `${t.marketplace.stockLeft} ${menu.stock}`}
              </div>
            </div>

            {/* Stock bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                <span>สต็อกคงเหลือ</span>
                <span className={`font-semibold ${colors.text}`}>{menu.stock}/{menu.maxStock}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${menu.maxStock > 0 ? (menu.stock / menu.maxStock) * 100 : 0}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${colors.bar}`}
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
