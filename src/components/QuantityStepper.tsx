interface Props {
  quantity: number
  onChange: (q: number) => void
  min?: number
  max?: number
}

export default function QuantityStepper({ quantity, onChange, min = 1, max = 10 }: Props) {
  return (
    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="w-9 h-9 flex items-center justify-center text-lg font-medium bg-gray-100 active:bg-gray-200 min-w-[44px] min-h-[44px]"
        disabled={quantity <= min}
      >
        −
      </button>
      <span className="w-9 h-9 flex items-center justify-center text-sm font-medium bg-white min-h-[44px]">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-9 h-9 flex items-center justify-center text-lg font-medium bg-gray-100 active:bg-gray-200 min-w-[44px] min-h-[44px]"
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  )
}
