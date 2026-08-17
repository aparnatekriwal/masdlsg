import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import QuantityStepper from '../components/QuantityStepper'
import ProductIcon from '../components/ProductIcon'
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../data/products'

export default function Cart() {
  const { state, dispatch, navigate, getCartTotal, getDeliveryFee, getOrderTotal } = useApp()

  if (state.cart.length === 0) {
    return (
      <div className="h-screen-dvh flex flex-col bg-white">
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-lg font-medium text-gray-800">Your cart is empty</p>
          <button
            onClick={() => navigate('storefront')}
            className="mt-4 text-blue-600 text-sm font-medium min-h-[44px] px-4"
          >
            Continue shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const deliveryFee = getDeliveryFee()
  const total = getOrderTotal()
  const freeDeliveryGap = FREE_DELIVERY_THRESHOLD - subtotal

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <TopBar />
      <div className="flex-1 overflow-y-auto overscroll-none">
        {freeDeliveryGap > 0 && (
          <div className="bg-blue-50 px-4 py-2 text-xs text-blue-800">
            Add S${freeDeliveryGap.toFixed(2)} more for free delivery
          </div>
        )}

        <div className="bg-white mt-1">
          {state.cart.map(item => (
            <div key={item.product.id} className="flex gap-3 p-3 border-b border-gray-100">
              <div className="shrink-0">
                <ProductIcon icon={item.product.icon} color={item.product.color} size={64} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.title}</p>
                <p className="text-sm font-bold mt-0.5">S${item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={q => dispatch({ type: 'UPDATE_QUANTITY', productId: item.product.id, quantity: q })}
                    min={0}
                  />
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: item.product.id })}
                    className="text-blue-600 text-xs min-h-[44px] flex items-center px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white mt-2 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({state.cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span className="font-medium">S${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Delivery</span>
            <span className={deliveryFee === 0 ? 'text-green-700 font-medium' : 'font-medium'}>
              {deliveryFee === 0 ? 'Free' : `S$${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t">
            <span>Total</span>
            <span>S${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              dispatch({ type: 'START_CHECKOUT' })
              navigate('review')
            }}
            className="w-full bg-amazon-yellow active:bg-amazon-yellow-hover text-navy font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Proceed to checkout
          </button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
