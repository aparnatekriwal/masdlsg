import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'

interface Props {
  onComplete: () => void
  bankColor: string
}

export default function PinPad({ onComplete, bankColor }: Props) {
  const { state, dispatch } = useApp()
  const [digits, setDigits] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faceIdActive, setFaceIdActive] = useState(false)

  const handleDigit = useCallback((d: string) => {
    if (verifying || error) return
    const newDigits = digits + d
    setDigits(newDigits)

    if (newDigits.length === 6) {
      setVerifying(true)
      dispatch({ type: 'LOG_EVENT', event: { screen: 'pin', action: 'pin-entered', timestamp: Date.now() } })

      if (state.failureMode === 'approval-timeout') {
        setTimeout(() => {
          setVerifying(false)
          setError('Request timed out. Please try again.')
          setDigits('')
        }, 8000)
      } else if (state.failureMode === 'insufficient-balance') {
        setTimeout(() => {
          setVerifying(false)
          setError('Insufficient balance in selected account.')
          setDigits('')
        }, 1500)
      } else {
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }
  }, [digits, verifying, error, dispatch, state.failureMode, onComplete])

  const handleBackspace = () => {
    if (verifying) return
    setDigits(prev => prev.slice(0, -1))
    setError(null)
  }

  const handleFaceId = () => {
    if (verifying) return
    setFaceIdActive(true)
    setVerifying(true)
    dispatch({ type: 'LOG_EVENT', event: { screen: 'pin', action: 'face-id', timestamp: Date.now() } })

    if (state.failureMode === 'approval-timeout') {
      setTimeout(() => {
        setVerifying(false)
        setFaceIdActive(false)
        setError('Request timed out. Please try again.')
      }, 8000)
    } else if (state.failureMode === 'insufficient-balance') {
      setTimeout(() => {
        setVerifying(false)
        setFaceIdActive(false)
        setError('Insufficient balance in selected account.')
      }, 1500)
    } else {
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <div className="flex flex-col items-center">
      {/* Face ID option */}
      <button
        onClick={handleFaceId}
        className="flex items-center gap-2 mb-6 text-sm min-h-[44px] px-4 py-2 rounded-lg active:bg-gray-100"
        style={{ color: bankColor }}
        disabled={verifying}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm6 0a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-4c-1.48 0-2.77-.81-3.46-2.01l1.73-1 .27.46c.38.65 1.08 1.05 1.85 1.05h-.78c.77 0 1.47-.4 1.85-1.05l.27-.46 1.73 1C14.77 15.19 13.48 16 12 16z" />
        </svg>
        Use Face ID instead
      </button>

      <p className="text-sm text-gray-600 mb-4">Enter your 6-digit PIN</p>

      {/* PIN dots */}
      <div className="flex gap-3 mb-6">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
              i < digits.length
                ? 'border-gray-800 bg-gray-800'
                : 'border-gray-300 bg-white'
            }`}
          />
        ))}
      </div>

      {/* Status messages */}
      {verifying && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
          {faceIdActive ? 'Verifying Face ID…' : 'Verifying…'}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg text-center max-w-xs">
          {error}
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {keys.map((key, idx) => {
          if (key === '') return <div key={idx} />
          if (key === 'del') {
            return (
              <button
                key={idx}
                onClick={handleBackspace}
                className="h-14 flex items-center justify-center text-gray-600 active:bg-gray-200 rounded-xl min-h-[56px]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l7-8h11a1 1 0 011 1v14a1 1 0 01-1 1H10l-7-8z" />
                </svg>
              </button>
            )
          }
          return (
            <button
              key={idx}
              onClick={() => handleDigit(key)}
              className="h-14 flex items-center justify-center text-xl font-medium bg-white rounded-xl shadow-sm active:bg-gray-100 min-h-[56px]"
              disabled={verifying}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
