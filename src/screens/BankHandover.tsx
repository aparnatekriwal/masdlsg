import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function BankHandover() {
  const { state, navigate } = useApp()
  const bank = state.selectedBank
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!bank) return

    if (state.failureMode === 'app-not-installed') {
      const timer = setTimeout(() => setShowError(true), 800)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => navigate('bankPayment'), 1000)
    return () => clearTimeout(timer)
  }, [bank, navigate, state.failureMode])

  if (!bank) return null

  if (showError) {
    return (
      <div className="h-screen-dvh flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: bank.color }}>
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-1">{bank.name} is not installed</p>
          <p className="text-sm text-gray-500 mb-4">
            The app could not be found on this device. Please choose another banking app.
          </p>
          <button
            onClick={() => navigate('bankSelect')}
            className="w-full bg-navy text-white font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Choose another app
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen-dvh flex flex-col items-center justify-center"
      style={{ backgroundColor: bank.color }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg animate-pulse"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: bank.textColor }}
      >
        {bank.name.substring(0, 2).toUpperCase()}
      </div>
      <p className="text-lg font-medium" style={{ color: bank.textColor }}>
        Opening {bank.name}…
      </p>
      <div className="mt-6 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
