import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function OrderConfirmation() {
  const { state, navigate, dispatch } = useApp()
  const [showReceipt, setShowReceipt] = useState(false)
  const [merchantStuck, setMerchantStuck] = useState(false)

  useEffect(() => {
    if (state.failureMode === 'merchant-no-update') {
      setMerchantStuck(true)
    }
  }, [state.failureMode])

  if (merchantStuck) {
    return (
      <div className="h-screen-dvh flex flex-col bg-white">
        <div className="bg-navy pt-safe px-4 py-3">
          <div className="text-amazon-yellow font-bold text-lg">ShopMart</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-navy rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-800">Verifying payment…</p>
          <p className="text-sm text-gray-500 mt-2">
            This is taking longer than expected. Please wait.
          </p>
        </div>
      </div>
    )
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const deliveryDate = tomorrow.toLocaleDateString('en-SG', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const handleContinueShopping = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <div className="bg-navy pt-safe px-4 py-3">
        <div className="text-amazon-yellow font-bold text-lg">ShopMart</div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-green-50 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-900">Order confirmed</p>
          <p className="text-sm text-gray-600 mt-1">Thank you for your purchase!</p>
        </div>

        <div className="bg-white p-4 mt-2 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order number</span>
            <span className="font-medium font-mono">{state.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium">
              PayNow — {state.selectedBank?.name || 'Bank App'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount paid</span>
            <span className="font-bold">S${state.orderTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span className="font-medium">{deliveryDate} by 9:00 PM</span>
          </div>
        </div>

        <div className="px-4 mt-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="text-blue-600 text-sm font-medium min-h-[44px]"
          >
            View receipt
          </button>
        </div>

        <div className="p-4 mt-2">
          <button
            onClick={handleContinueShopping}
            className="w-full bg-amazon-yellow active:bg-amazon-yellow-hover text-navy font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Continue shopping
          </button>
        </div>
        <div className="h-16" />
      </div>

      {/* Receipt overlay */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowReceipt(false)}>
          <div
            className="bg-white w-full rounded-t-2xl p-6 pb-safe max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Receipt</h2>
              <button onClick={() => setShowReceipt(false)} className="text-gray-500 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="font-bold text-lg">ShopMart SG</p>
              <p className="text-xs text-gray-500">shopmart.sg</p>
            </div>

            <div className="border-t border-dashed pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order</span>
                <span className="font-mono">{state.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{state.orderTimestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span>PayNow</span>
              </div>
            </div>

            <div className="border-t border-dashed mt-3 pt-3">
              <p className="text-xs text-gray-500 text-center mt-2">
                This is a demo receipt. No actual purchase was made.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
