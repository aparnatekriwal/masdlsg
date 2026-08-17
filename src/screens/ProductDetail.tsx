import { useState } from 'react'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import QuantityStepper from '../components/QuantityStepper'
import StarRating from '../components/StarRating'
import ProductIcon from '../components/ProductIcon'

export default function ProductDetail() {
  const { state, navigate, addToCart, dispatch } = useApp()
  const [quantity, setQuantity] = useState(1)
  const product = state.selectedProduct
  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product, quantity)
    dispatch({ type: 'SHOW_TOAST', message: 'Added to cart' })
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 1500)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('cart')
  }

  return (
    <div className="h-screen-dvh flex flex-col bg-white">
      <TopBar />
      <div className="flex-1 overflow-y-auto overscroll-none">
        <div className="bg-gray-50 flex items-center justify-center p-6">
          <ProductIcon icon={product.icon} color={product.color} size={200} />
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500">{product.subtitle}</p>
          <h1 className="text-lg font-medium text-gray-900 mt-0.5">{product.title}</h1>
          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="mt-3 border-t pt-3">
            <span className="text-2xl font-bold">
              <span className="text-sm align-top">S$</span>
              {product.price.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500 mt-0.5">Prices are GST-inclusive</p>
          </div>

          <p className="text-sm text-green-700 mt-2 font-medium">In stock</p>
          <p className="text-xs text-gray-600 mt-0.5">Free delivery tomorrow</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-700">Qty:</span>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-amazon-yellow active:bg-amazon-yellow-hover text-navy font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full mt-2 bg-amazon-orange active:bg-amazon-orange-hover text-white font-medium py-3 rounded-full text-sm min-h-[48px]"
          >
            Buy Now
          </button>

          <button
            onClick={() => navigate('storefront')}
            className="w-full mt-3 text-blue-600 text-sm py-2 min-h-[44px]"
          >
            ← Continue shopping
          </button>
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
