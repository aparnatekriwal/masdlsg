import { useApp } from '../context/AppContext'
import { useLongPress } from '../hooks/useLongPress'

export default function TopBar() {
  const { state, navigate, getCartCount, dispatch } = useApp()

  const longPressProps = useLongPress(() => {
    dispatch({ type: 'TOGGLE_CONTROL_PANEL' })
  }, 2000)

  return (
    <div className="bg-navy pt-safe sticky top-0 z-40" {...longPressProps}>
      <div className="flex items-center px-3 py-2 gap-2">
        <div className="text-amazon-yellow font-bold text-lg tracking-tight select-none"
          onClick={() => navigate('storefront')}>
          ShopMart
        </div>
        <div className="flex-1 relative">
          <div className="bg-white rounded flex items-center px-2 h-9">
            <svg className="w-4 h-4 text-gray-400 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-gray-400 text-sm truncate">Search ShopMart.sg</span>
          </div>
        </div>
        <button
          className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => navigate('cart')}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          {getCartCount() > 0 && (
            <span className="absolute -top-0 -right-0 bg-amazon-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>
      <div className="flex items-center px-3 pb-1.5 gap-1">
        <svg className="w-3.5 h-3.5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span className="text-white text-xs">Deliver to Singapore 238873</span>
      </div>
    </div>
  )
}
