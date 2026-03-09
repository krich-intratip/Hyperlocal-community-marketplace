'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart.store'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQty, removeItem, clearCart, totalPrice, itemsByProvider } = useCartStore()
  const grouped = itemsByProvider()
  const providerIds = Object.keys(grouped)
  const subtotal = totalPrice()
  const platformFee = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + platformFee

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">ตะกร้าสินค้า</h2>
                {items.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => clearCart()}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-2 py-1"
                  >
                    ล้างตะกร้า
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <Package className="h-16 w-16 text-slate-200 mb-4" />
                  <p className="font-bold text-slate-500 mb-1">ตะกร้าว่างเปล่า</p>
                  <p className="text-sm text-slate-400 mb-5">เพิ่มสินค้าหรือบริการจาก Marketplace</p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    ไปที่ Marketplace
                  </button>
                </div>
              ) : (
                providerIds.map((providerId) => {
                  const providerItems = grouped[providerId]
                  const first = providerItems[0]
                  const providerSubtotal = providerItems.reduce((s, i) => s + i.price * i.qty, 0)
                  return (
                    <div key={providerId}>
                      {/* Provider header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{first.providerAvatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{first.provider}</p>
                          <p className="text-xs text-slate-400 truncate">{first.community}</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">฿{providerSubtotal.toLocaleString()}</span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 pl-1">
                        {providerItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex items-start gap-3"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                              {item.listingImage}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                                {item.menuName ?? item.listingTitle}
                              </p>
                              {item.menuName && (
                                <p className="text-xs text-slate-400 truncate">{item.listingTitle}</p>
                              )}
                              <p className="text-xs text-blue-600 font-bold mt-0.5">฿{item.price}/{item.unit}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-slate-300 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateQty(item.id, item.qty - 1)}
                                  className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
                                >
                                  <Minus className="h-3 w-3 text-slate-500" />
                                </button>
                                <span className="w-6 text-center text-sm font-extrabold text-slate-800 dark:text-white">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
                                >
                                  <Plus className="h-3 w-3 text-slate-500" />
                                </button>
                              </div>
                              <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                                ฿{(item.price * item.qty).toLocaleString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {providerIds.indexOf(providerId) < providerIds.length - 1 && (
                        <div className="mt-4 border-t border-dashed border-slate-200 dark:border-slate-700" />
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer summary + checkout */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 space-y-3 bg-white dark:bg-slate-900">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>ค่าบริการแพลตฟอร์ม (5%)</span>
                    <span>฿{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-white pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <span>รวมทั้งหมด</span>
                    <span className="text-blue-700">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                >
                  สรุปคำสั่งซื้อ <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
