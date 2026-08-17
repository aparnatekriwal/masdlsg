interface Props {
  rating: number
  count: number
}

export default function StarRating({ rating, count }: Props) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="text-amber-500">★</span>)
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className="relative inline-block">
          <span className="text-gray-300">★</span>
          <span className="absolute inset-0 overflow-hidden w-[50%] text-amber-500">★</span>
        </span>
      )
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>)
    }
  }

  return (
    <div className="flex items-center gap-0.5 text-xs">
      <span className="flex">{stars}</span>
      <span className="text-blue-600 ml-0.5">{count.toLocaleString()}</span>
    </div>
  )
}
