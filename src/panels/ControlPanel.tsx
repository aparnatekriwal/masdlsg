import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { PaymentVariant, FailureMode } from '../types'

export default function ControlPanel() {
  const { state, dispatch } = useApp()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!state.checkoutStartTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - state.checkoutStartTime!) / 1000))
    }, 100)
    return () => clearInterval(interval)
  }, [state.checkoutStartTime])

  if (!state.showControlPanel) return null

  const checkoutSteps = state.sessionEvents.filter(e => {
    const checkoutScreens = ['review', 'payment', 'bankSelect', 'handover', 'bankPayment', 'bankSuccess', 'confirmation', 'notificationOverlay', 'pin']
    return checkoutScreens.includes(e.screen) && e.action === 'navigate'
  }).length

  const handleExport = () => {
    const data = {
      variant: state.variant,
      failureMode: state.failureMode,
      checkoutSteps,
      elapsedSeconds: elapsed,
      events: state.sessionEvents,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paynow-session-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const variants: { value: PaymentVariant; label: string; desc: string }[] = [
    { value: 'choose-each-time', label: 'App chosen each time', desc: 'User picks a bank app every time' },
    { value: 'remembered-app', label: 'App remembered', desc: 'Bank app chooser is skipped' },
    { value: 'no-handover', label: 'No handover', desc: 'Approve via notification overlay' },
  ]

  const failures: { value: FailureMode; label: string }[] = [
    { value: 'none', label: 'No failure (happy path)' },
    { value: 'app-not-installed', label: 'Bank app not installed' },
    { value: 'approval-timeout', label: 'Approval times out' },
    { value: 'merchant-no-update', label: 'Merchant page stuck' },
    { value: 'insufficient-balance', label: 'Insufficient balance' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end" onClick={() => dispatch({ type: 'HIDE_CONTROL_PANEL' })}>
      <div
        className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto pb-safe"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Demo Control Panel</h2>
          <button
            onClick={() => dispatch({ type: 'HIDE_CONTROL_PANEL' })}
            className="text-gray-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-navy">{checkoutSteps}</p>
              <p className="text-xs text-gray-500 mt-0.5">Steps from checkout</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-navy">
                {state.checkoutStartTime ? `${elapsed}s` : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Elapsed time</p>
            </div>
          </div>

          {/* Variant switch */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Payment variant</p>
            <div className="space-y-2">
              {variants.map(v => (
                <button
                  key={v.value}
                  onClick={() => dispatch({ type: 'SET_VARIANT', variant: v.value })}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left min-h-[52px] ${
                    state.variant === v.value ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    state.variant === v.value ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {state.variant === v.value && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{v.label}</p>
                    <p className="text-xs text-gray-500">{v.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Failure mode */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Failure mode</p>
            <div className="space-y-1.5">
              {failures.map(f => (
                <button
                  key={f.value}
                  onClick={() => dispatch({ type: 'SET_FAILURE_MODE', mode: f.value })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left min-h-[44px] ${
                    state.failureMode === f.value ? 'bg-red-50 ring-2 ring-red-400' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    state.failureMode === f.value ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {state.failureMode === f.value && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <span className="text-sm">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t">
            <button
              onClick={handleExport}
              className="w-full bg-navy text-white font-medium py-3 rounded-xl text-sm min-h-[48px]"
            >
              Export session as JSON
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'HIDE_CONTROL_PANEL' })
                dispatch({ type: 'RESET' })
              }}
              className="w-full bg-red-600 text-white font-medium py-3 rounded-xl text-sm min-h-[48px]"
            >
              Reset to storefront
            </button>
          </div>
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}
