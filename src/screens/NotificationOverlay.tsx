import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { bankApps } from '../data/banks'
import PinPad from '../components/PinPad'

export default function NotificationOverlay() {
  const { state, navigate, dispatch, getOrderTotal } = useApp()
  const total = getOrderTotal()
  const [phase, setPhase] = useState<'notification' | 'approve' | 'verifying'>('notification')
  const [notificationVisible, setNotificationVisible] = useState(false)

  const defaultBank = state.rememberedBank || bankApps[0]

  useEffect(() => {
    const timer = setTimeout(() => setNotificationVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleNotificationTap = () => {
    dispatch({ type: 'SELECT_BANK', bank: defaultBank })
    dispatch({ type: 'LOG_EVENT', event: { screen: 'notification', action: 'tap-notification', timestamp: Date.now() } })
    setPhase('approve')
  }

  const handleApproveComplete = () => {
    dispatch({ type: 'COMPLETE_ORDER' })
    dispatch({ type: 'LOG_EVENT', event: { screen: 'notification', action: 'approved', timestamp: Date.now() } })
    navigate('confirmation')
  }

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100 relative">
      {/* Merchant checkout page underneath */}
      <div className="bg-navy pt-safe px-4 py-3">
        <div className="text-amazon-yellow font-bold text-lg">ShopMart</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-3 border-gray-300 border-t-navy rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-800">Waiting for payment approval…</p>
        <p className="text-sm text-gray-500 mt-2">
          A notification has been sent to your banking app.
        </p>
      </div>

      {/* Notification banner sliding from top */}
      {notificationVisible && phase === 'notification' && (
        <button
          onClick={handleNotificationTap}
          className="fixed top-0 left-0 right-0 z-50 animate-slideDown"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="mx-3 mt-2 bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 active:bg-gray-50">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: defaultBank.color, color: defaultBank.textColor }}
            >
              {defaultBank.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">{defaultBank.name}</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                Approve payment of S${total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">to ShopMart SG Pte Ltd</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">now</span>
          </div>
        </button>
      )}

      {/* Approval overlay */}
      {phase === 'approve' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 pb-safe">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: defaultBank.color, color: defaultBank.textColor }}
              >
                {defaultBank.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{defaultBank.name}</p>
                <p className="text-xs text-gray-500">Payment approval</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold">S${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payee</span>
                <span className="font-medium">ShopMart SG Pte Ltd</span>
              </div>
            </div>

            <PinPad onComplete={handleApproveComplete} bankColor={defaultBank.color} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-120%); }
          to { transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
