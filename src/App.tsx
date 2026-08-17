import React, { useEffect, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { useIsMobile } from './hooks/useMediaQuery'
import DesktopGate from './screens/DesktopGate'
import Storefront from './screens/Storefront'
import ProductDetail from './screens/ProductDetail'
import Cart from './screens/Cart'
import ReviewOrder from './screens/ReviewOrder'
import PaymentMethods from './screens/PaymentMethods'
import BankAppSelector from './screens/BankAppSelector'
import BankHandover from './screens/BankHandover'
import BankPaymentScreen from './screens/BankPaymentScreen'
import BankSuccess from './screens/BankSuccess'
import OrderConfirmation from './screens/OrderConfirmation'
import NotificationOverlay from './screens/NotificationOverlay'
import DemoTag from './components/DemoTag'
import ControlPanel from './panels/ControlPanel'

function Toast() {
  const { state } = useApp()
  if (!state.toastMessage) return null

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn">
      {state.toastMessage}
    </div>
  )
}

function AppContent() {
  const { state, dispatch } = useApp()
  const isMobile = useIsMobile()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'D') {
      dispatch({ type: 'TOGGLE_CONTROL_PANEL' })
    }
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isMobile) {
    return <DesktopGate />
  }

  const screens: Record<string, React.ReactNode> = {
    storefront: <Storefront />,
    product: <ProductDetail />,
    cart: <Cart />,
    review: <ReviewOrder />,
    payment: <PaymentMethods />,
    bankSelect: <BankAppSelector />,
    handover: <BankHandover />,
    bankPayment: <BankPaymentScreen />,
    bankSuccess: <BankSuccess />,
    confirmation: <OrderConfirmation />,
    notificationOverlay: <NotificationOverlay />,
  }

  return (
    <div className="h-screen-dvh overflow-hidden bg-white">
      {screens[state.screen] || <Storefront />}
      <DemoTag />
      <Toast />
      <ControlPanel />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </AppProvider>
  )
}
