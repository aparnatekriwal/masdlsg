import type { Product } from '../types'
import StarRating from './StarRating'
import ProductIcon from './ProductIcon'

interface Props {
  product: Product
  onTap: (p: Product) => void
}

export default function ProductCard({ product, onTap }: Props) {
  const freeDelivery = product.price >= 60 || true

  return (
    <button
      onClick={() => onTap(product)}
      className="bg-white rounded-lg shadow-sm overflow-hidden text-left w-full active:bg-gray-50 min-h-[44px]"
    >
      <div className="flex items-center justify-center bg-gray-50 p-3">
        <ProductIcon icon={product.icon} color={product.color} size={100} />
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
          {product.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{product.subtitle}</p>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <p className="text-base font-bold mt-1">
          <span className="text-xs align-top">S$</span>
          {product.price.toFixed(2)}
        </p>
        {freeDelivery && (
          <p className="text-xs text-green-700 mt-0.5">Free delivery tomorrow</p>
        )}
      </div>
    </button>
  )
}
