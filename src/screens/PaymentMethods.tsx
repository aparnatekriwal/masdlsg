import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { paymentMethods } from '../data/paymentMethods'

function PaymentIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    paynow: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#7B2D8E" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">PN</text>
      </svg>
    ),
    card: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#1a73e8" />
        <rect x="6" y="9" width="20" height="14" rx="2" fill="white" opacity="0.9" />
        <rect x="6" y="13" width="20" height="3" fill="#1a73e8" opacity="0.5" />
      </svg>
    ),
    applepay: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#000" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Pay</text>
      </svg>
    ),
    grabpay: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#00b14f" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">GP</text>
      </svg>
    ),
    shopeepay: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#ee4d2d" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">SP</text>
      </svg>
    ),
    nets: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#003087" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">NETS</text>
      </svg>
    ),
    atome: (
      <svg className="w-8 h-8" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#3fcd84" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">A÷3</text>
      </svg>
    ),
  }
  return icons[id] || <div className="w-8 h-8 bg-gray-200 rounded-md" />
}

export default function PaymentMethods() {
  const { state, navigate, dispatch, getOrderTotal: calcTotal } = useApp()
  const [selected, setSelected] = useState('paynow')
  const [disabledToast, setDisabledToast] = useState<string | null>(null)
  const total = calcTotal()

  const handleSelect = (id: string, enabled: boolean) => {
    if (!enabled) {
      setDisabledToast(id)
      setTimeout(() => setDisabledToast(null), 1500)
      return
    }
    setSelected(id)
  }

  const handleProceed = () => {
    if (selected !== 'paynow') return
    dispatch({ type: 'LOG_EVENT', event: { screen: 'payment', action: 'select-paynow', timestamp: Date.now() } })

    if (state.variant === 'no-handover') {
      navigate('notificationOverlay')
    } else if (state.variant === 'remembered-app' && state.rememberedBank) {
      dispatch({ type: 'SELECT_BANK', bank: state.rememberedBank })
      navigate('handover')
    } else {
      navigate('bankSelect')
    }
  }

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <div className="bg-navy pt-safe px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('review')} className="text-white min-w-[44px] min-h-[44px] flex items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-medium text-lg">Payment</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-white p-4 mt-1">
          <p className="text-sm font-medium mb-1">Total: <span className="text-lg font-bold">S${total.toFixed(2)}</span></p>
        </div>

        <div className="bg-white mt-2">
          <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Select payment method</p>
          {paymentMethods.map(pm => (
            <div key={pm.id} className="relative">
              <button
                onClick={() => handleSelect(pm.id, pm.enabled)}
                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[56px] active:bg-gray-50 border-b border-gray-100 ${
                  selected === pm.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected === pm.id ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {selected === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <PaymentIcon id={pm.id} />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium">{pm.name}</p>
                  <p className="text-xs text-gray-500">{pm.subtitle}</p>
                </div>
                {!pm.enabled && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Demo only</span>
                )}
              </button>
              {disabledToast === pm.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-medium rounded z-10">
                  Not part of this demo
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 mt-2">
          <button
            onClick={handleProceed}
            className={`w-full font-medium py-3 rounded-full text-sm min-h-[48px] ${
              selected === 'paynow'
                ? 'bg-amazon-orange active:bg-amazon-orange-hover text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
            disabled={selected !== 'paynow'}
          >
            Pay with PayNow
          </button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
