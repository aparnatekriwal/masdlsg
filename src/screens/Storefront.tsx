import { useState } from 'react'
import TopBar from '../components/TopBar'
import CategoryStrip from '../components/CategoryStrip'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useApp } from '../context/AppContext'
import type { Product } from '../types'

export default function Storefront() {
  const [category, setCategory] = useState('All')
  const { navigate, dispatch } = useApp()

  const filtered = category === 'All'
    ? products
    : products.filter(p => p.category === category)

  const handleProductTap = (product: Product) => {
    dispatch({ type: 'SELECT_PRODUCT', product })
    navigate('product')
  }

  return (
    <div className="h-screen-dvh flex flex-col bg-gray-100">
      <TopBar />
      <CategoryStrip selected={category} onSelect={setCategory} />
      <div className="flex-1 overflow-y-auto overscroll-none pb-safe">
        <div className="grid grid-cols-2 gap-2 p-2">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onTap={handleProductTap} />
          ))}
        </div>
        <div className="h-16" />
      </div>
    </div>
  )
}
