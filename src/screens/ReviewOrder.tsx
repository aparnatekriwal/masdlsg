import { useApp } from '../context/AppContext'
import ProductIcon from '../components/ProductIcon'

export default function ReviewOrder() {
  const { state, navigate, getCartTotal, getDeliveryFee, getOrderTotal } = useApp()
  const subtotal = getCartTotal()
  const deliveryFee = getDeliveryFee()
  const total = getOrderTotal()

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <div className="bg-navy pt-safe px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('cart')} className="text-white min-w-[44px] min-h-[44px] flex items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-medium text-lg">Review your order</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-white p-4 mt-1">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium">Delivery address</p>
              <p className="text-sm text-gray-600 mt-0.5">
                John Tan<br />
                81 Victoria Street, #12-04<br />
                Singapore 188065
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 mt-2">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium">Delivery option</p>
              <p className={`text-sm mt-0.5 ${deliveryFee === 0 ? 'text-green-700' : 'text-gray-600'}`}>
                {deliveryFee === 0 ? 'Free delivery' : `Standard delivery — S$${deliveryFee.toFixed(2)}`}
              </p>
              <p className="text-sm text-gray-600">Tomorrow by 9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 mt-2">
          <p className="text-sm font-medium mb-3">Order summary</p>
          {state.cart.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 py-2">
              <ProductIcon icon={item.product.icon} color={item.product.color} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{item.product.title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium shrink-0">
                S${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>S${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : `S$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1 border-t">
              <span>Order total</span>
              <span>S${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => navigate('payment')}
            className="w-full bg-amazon-orange active:bg-amazon-orange-hover text-white font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Place your order
          </button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
