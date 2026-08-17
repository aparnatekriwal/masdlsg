import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { bankApps } from '../data/banks'
import type { BankApp } from '../types'

export default function BankAppSelector() {
  const { navigate, dispatch, state } = useApp()
  const [rememberApp, setRememberApp] = useState(false)

  const mostUsed = bankApps.filter(b => b.section === 'most-used')
  const other = bankApps.filter(b => b.section === 'other')

  const handleSelect = (bank: BankApp) => {
    dispatch({ type: 'SELECT_BANK', bank })
    if (rememberApp) {
      dispatch({ type: 'REMEMBER_BANK', bank })
    }
    dispatch({ type: 'LOG_EVENT', event: { screen: 'bankSelect', action: `select:${bank.id}`, timestamp: Date.now() } })

    if (state.failureMode === 'app-not-installed') {
      navigate('handover')
    } else {
      navigate('handover')
    }
  }

  const BankButton = ({ bank }: { bank: BankApp }) => (
    <button
      onClick={() => handleSelect(bank)}
      className="flex items-center gap-3 w-full px-4 py-3 active:bg-gray-50 min-h-[52px]"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
        style={{ backgroundColor: bank.color, color: bank.textColor }}
      >
        {bank.name.substring(0, 2).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-gray-900">{bank.name}</span>
      <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <div className="bg-navy pt-safe px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('payment')} className="text-white min-w-[44px] min-h-[44px] flex items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-medium text-lg">Choose your bank</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-white mt-1 p-4">
          <p className="text-sm text-gray-600">
            Select your banking app to complete payment via PayNow.
          </p>
        </div>

        <div className="bg-white mt-2">
          <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Most used</p>
          {mostUsed.map(bank => (
            <BankButton key={bank.id} bank={bank} />
          ))}
        </div>

        <div className="bg-white mt-2">
          <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Other apps</p>
          {other.map(bank => (
            <BankButton key={bank.id} bank={bank} />
          ))}
        </div>

        <div className="bg-white mt-2 px-4 py-3">
          <label className="flex items-center gap-3 min-h-[44px]">
            <input
              type="checkbox"
              checked={rememberApp}
              onChange={e => setRememberApp(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm text-gray-700">Remember this app for next time</span>
          </label>
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
