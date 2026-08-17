import { useApp } from '../context/AppContext'
import { useRef, useEffect } from 'react'

export default function DemoTag() {
  const { state, dispatch } = useApp()
  const lastTapRef = useRef(0)

  useEffect(() => {
    if (state.demoTapCount >= 5) {
      dispatch({ type: 'TOGGLE_CONTROL_PANEL' })
      dispatch({ type: 'RESET_DEMO_TAPS' })
    }
  }, [state.demoTapCount, dispatch])

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current > 2000) {
      dispatch({ type: 'RESET_DEMO_TAPS' })
    }
    lastTapRef.current = now
    dispatch({ type: 'INCREMENT_DEMO_TAP' })
  }

  return (
    <button
      onClick={handleTap}
      className="fixed bottom-3 right-3 z-50 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg opacity-80 select-none"
      style={{ paddingBottom: 'max(2px, env(safe-area-inset-bottom))' }}
    >
      DEMO
    </button>
  )
}
