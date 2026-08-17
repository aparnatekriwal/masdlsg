import { useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'

export default function BankSuccess() {
  const { state, navigate, dispatch, getOrderTotal } = useApp()
  const bank = state.selectedBank
  const total = state.orderTotal > 0 ? state.orderTotal : getOrderTotal()

  const refNumber = useMemo(() => 'TXN' + Date.now().toString().slice(-8), [])
  const timestamp = useMemo(() => {
    const now = new Date()
    return now.toLocaleString('en-SG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
  }, [])

  useEffect(() => {
    if (state.failureMode === 'merchant-no-update') {
      dispatch({ type: 'COMPLETE_ORDER' })
      const timer = setTimeout(() => navigate('confirmation'), 2000)
      return () => clearTimeout(timer)
    }

    dispatch({ type: 'COMPLETE_ORDER' })
    const timer = setTimeout(() => navigate('confirmation'), 2000)
    return () => clearTimeout(timer)
  }, [navigate, dispatch, state.failureMode])

  if (!bank) return null

  return (
    <div className="h-screen-dvh flex flex-col bg-bank-blue-light">
      <div className="pt-safe px-4 py-3" style={{ backgroundColor: bank.color }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-white/20" style={{ color: bank.textColor }}>
            {bank.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium" style={{ color: bank.textColor }}>{bank.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-bank-success flex items-center justify-center mb-5">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xl font-bold text-gray-900">Payment Successful</p>
        <p className="text-3xl font-bold mt-2 text-gray-900">S${total.toFixed(2)}</p>

        <div className="bg-white rounded-xl shadow-sm w-full max-w-xs mt-6 p-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payee</span>
            <span className="font-medium">ShopMart SG Pte Ltd</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="font-medium font-mono">{refNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-medium text-right">{timestamp}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You will be returned to ShopMart SG…
        </p>
        <div className="mt-3 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
