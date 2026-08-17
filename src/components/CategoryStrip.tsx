import { categories } from '../data/products'

interface Props {
  selected: string
  onSelect: (cat: string) => void
}

export default function CategoryStrip({ selected, onSelect }: Props) {
  return (
    <div className="bg-navy-light overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-3 py-2 min-w-max">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap min-h-[36px] transition-colors ${
              selected === cat
                ? 'bg-white text-navy font-medium'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
