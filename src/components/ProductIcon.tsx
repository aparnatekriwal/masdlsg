import React from 'react'

interface Props {
  icon: string
  color: string
  size?: number
}

export default function ProductIcon({ icon, color, size = 120 }: Props) {
  const iconPaths: Record<string, React.ReactNode> = {
    mug: (
      <g>
        <rect x="30" y="35" width="40" height="45" rx="4" fill="white" opacity="0.9" />
        <path d="M70 45h10a8 8 0 010 16H70" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <rect x="35" y="80" width="30" height="4" rx="2" fill="white" opacity="0.6" />
      </g>
    ),
    headphones: (
      <g>
        <path d="M30 55a20 20 0 0140 0" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <rect x="25" y="50" width="10" height="20" rx="4" fill="white" opacity="0.9" />
        <rect x="65" y="50" width="10" height="20" rx="4" fill="white" opacity="0.9" />
      </g>
    ),
    glasses: (
      <g>
        <circle cx="35" cy="55" r="12" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <circle cx="65" cy="55" r="12" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <path d="M47 55h6" stroke="white" strokeWidth="2" opacity="0.9" />
        <path d="M23 52l-5-3M77 52l5-3" stroke="white" strokeWidth="2" opacity="0.9" />
      </g>
    ),
    desk: (
      <g>
        <rect x="20" y="40" width="60" height="5" rx="2" fill="white" opacity="0.9" />
        <rect x="25" y="45" width="4" height="30" fill="white" opacity="0.7" />
        <rect x="71" y="45" width="4" height="30" fill="white" opacity="0.7" />
        <rect x="35" y="55" width="30" height="3" rx="1" fill="white" opacity="0.5" />
      </g>
    ),
    cable: (
      <g>
        <rect x="35" y="35" width="30" height="30" rx="6" fill="white" opacity="0.9" />
        <circle cx="43" cy="50" r="4" fill={color} opacity="0.8" />
        <circle cx="57" cy="50" r="4" fill={color} opacity="0.8" />
        <circle cx="50" cy="43" r="4" fill={color} opacity="0.8" />
      </g>
    ),
    noodles: (
      <g>
        <rect x="28" y="40" width="44" height="30" rx="6" fill="white" opacity="0.9" />
        <path d="M35 48c3-4 6 4 9 0s6 4 9 0s6 4 9 0" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
        <path d="M35 56c3-4 6 4 9 0s6 4 9 0s6 4 9 0" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
      </g>
    ),
    laptop: (
      <g>
        <rect x="25" y="38" width="50" height="30" rx="3" fill="white" opacity="0.9" />
        <rect x="20" y="68" width="60" height="5" rx="2" fill="white" opacity="0.7" />
        <rect x="30" y="43" width="40" height="20" rx="1" fill={color} opacity="0.3" />
      </g>
    ),
    bottle: (
      <g>
        <rect x="38" y="25" width="24" height="55" rx="10" fill="white" opacity="0.9" />
        <rect x="42" y="20" width="16" height="8" rx="3" fill="white" opacity="0.7" />
        <rect x="42" y="50" width="16" height="2" fill={color} opacity="0.3" />
      </g>
    ),
    lamp: (
      <g>
        <path d="M50 30l-15 30h30z" fill="white" opacity="0.9" />
        <rect x="48" y="60" width="4" height="15" fill="white" opacity="0.7" />
        <rect x="40" y="75" width="20" height="3" rx="1" fill="white" opacity="0.6" />
        <circle cx="50" cy="48" r="4" fill={color} opacity="0.5" />
      </g>
    ),
    mouse: (
      <g>
        <ellipse cx="50" cy="55" rx="16" ry="22" fill="white" opacity="0.9" />
        <line x1="50" y1="38" x2="50" y2="50" stroke={color} strokeWidth="2" opacity="0.5" />
        <circle cx="50" cy="42" r="3" fill={color} opacity="0.4" />
      </g>
    ),
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect width="100" height="100" rx="12" fill={color} />
      {iconPaths[icon] || (
        <rect x="25" y="25" width="50" height="50" rx="8" fill="white" opacity="0.8" />
      )}
    </svg>
  )
}
