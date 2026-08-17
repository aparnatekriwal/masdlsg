import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import PinPad from '../components/PinPad'

const accounts = [
  { label: 'Savings Account', number: '•••• 4821', balance: 12450.30 },
  { label: 'Current Account', number: '•••• 7293', balance: 3280.15 },
]

export default function BankPaymentScreen() {
  const { state, dispatch, navigate, getOrderTotal } = useApp()
  const bank = state.selectedBank
  const total = getOrderTotal()
  const [showPin, setShowPin] = useState(false)
  const orderRef = useMemo(() => 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(), [])

  if (!bank) return null

  const handlePayTap = () => {
    dispatch({ type: 'LOG_EVENT', event: { screen: 'bankPayment', action: 'tap-pay', timestamp: Date.now() } })
    setShowPin(true)
  }

  const handlePinComplete = () => {
    dispatch({ type: 'LOG_EVENT', event: { screen: 'bankPayment', action: 'pin-verified', timestamp: Date.now() } })
    navigate('bankSuccess')
  }

  if (showPin) {
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
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <PinPad onComplete={handlePinComplete} bankColor={bank.color} />
        </div>
      </div>
    )
  }

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

      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-white mx-3 mt-4 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Payment Request</p>
            <p className="text-2xl font-bold mt-1">S${total.toFixed(2)}</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payee</span>
              <span className="text-sm font-medium text-right">ShopMart SG Pte Ltd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">UEN</span>
              <span className="text-sm font-medium font-mono">T12XX5678X</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reference</span>
              <span className="text-sm font-medium font-mono">{orderRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-sm font-bold">S${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 px-4 py-2.5 text-xs text-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Details provided by merchant via PayNow</span>
          </div>
        </div>

        <div className="bg-white mx-3 mt-3 rounded-xl shadow-sm overflow-hidden">
          <p className="px-4 pt-3 pb-1 text-xs text-gray-500 uppercase tracking-wider font-medium">Pay from</p>
          {accounts.map((acc, idx) => (
            <button
              key={idx}
              onClick={() => dispatch({ type: 'SELECT_ACCOUNT', index: idx })}
              className={`w-full flex items-center gap-3 px-4 py-3 min-h-[52px] active:bg-gray-50 ${
                idx < accounts.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                state.selectedAccount === idx ? 'border-blue-600' : 'border-gray-300'
              }`}>
                {state.selectedAccount === idx && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium">{acc.label}</p>
                <p className="text-xs text-gray-500">{acc.number}</p>
              </div>
              <p className="text-sm text-gray-700">S${acc.balance.toLocaleString('en-SG', { minimumFractionDigits: 2 })}</p>
            </button>
          ))}
        </div>

        <div className="p-4 mt-2 pb-safe">
          <button
            onClick={handlePayTap}
            className="w-full text-white font-medium py-3.5 rounded-xl text-sm min-h-[48px] shadow-sm"
            style={{ backgroundColor: bank.color }}
          >
            Pay S${total.toFixed(2)}
          </button>
        </div>
        <div className="h-8" />
      </div>
    </div>
  )
}
