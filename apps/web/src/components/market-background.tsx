'use client'

export function MarketBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />

      {/* Scattered market/service icons — large, very faint */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* ---- food bowl top-left ---- */}
        <g transform="translate(60,80) rotate(-12)">
          <ellipse cx="0" cy="0" rx="40" ry="14" fill="#1d4ed8" />
          <ellipse cx="0" cy="-6" rx="34" ry="28" fill="none" stroke="#1d4ed8" strokeWidth="5" />
          <path d="M-18,-30 Q0,-46 18,-30" fill="none" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ---- wrench top-right ---- */}
        <g transform="translate(900,100) rotate(30)">
          <rect x="-6" y="-50" width="12" height="90" rx="6" fill="#1d4ed8" />
          <circle cx="0" cy="-50" r="16" fill="none" stroke="#1d4ed8" strokeWidth="9" />
          <circle cx="0" cy="-50" r="7" fill="#1d4ed8" />
        </g>

        {/* ---- house / home service center ---- */}
        <g transform="translate(480,60) rotate(5)">
          <path d="M0,-50 L-55,10 L55,10 Z" fill="#1d4ed8" />
          <rect x="-35" y="10" width="70" height="50" rx="3" fill="#1d4ed8" />
          <rect x="-12" y="28" width="24" height="32" rx="2" fill="white" fillOpacity="0.4" />
        </g>

        {/* ---- books / tutoring bottom-left ---- */}
        <g transform="translate(80,620) rotate(-8)">
          <rect x="-48" y="-30" width="28" height="60" rx="3" fill="#1d4ed8" />
          <rect x="-14" y="-30" width="28" height="60" rx="3" fill="#1d4ed8" opacity="0.7" />
          <rect x="20" y="-30" width="28" height="60" rx="3" fill="#1d4ed8" opacity="0.5" />
        </g>

        {/* ---- seedling / agriculture bottom-right ---- */}
        <g transform="translate(920,660) rotate(10)">
          <line x1="0" y1="40" x2="0" y2="-20" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
          <path d="M0,0 Q30,-30 10,-60" fill="none" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
          <path d="M0,-10 Q-28,-30 -8,-58" fill="none" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* ---- shopping bag center-left ---- */}
        <g transform="translate(200,350) rotate(-15)">
          <rect x="-32" y="-16" width="64" height="54" rx="6" fill="none" stroke="#1d4ed8" strokeWidth="6" />
          <path d="M-16,-16 Q-16,-44 0,-44 Q16,-44 16,-16" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* ---- heart / elderly care center-right ---- */}
        <g transform="translate(820,320) rotate(12)">
          <path d="M0,36 C0,36 -50,-8 -50,-28 C-50,-50 -28,-58 0,-36 C28,-58 50,-50 50,-28 C50,-8 0,36 0,36 Z" fill="none" stroke="#1d4ed8" strokeWidth="7" />
        </g>

        {/* ---- scissors / handmade top-center ---- */}
        <g transform="translate(650,140) rotate(-20)">
          <circle cx="-24" cy="-24" r="14" fill="none" stroke="#1d4ed8" strokeWidth="6" />
          <circle cx="24" cy="-24" r="14" fill="none" stroke="#1d4ed8" strokeWidth="6" />
          <line x1="-14" y1="-14" x2="44" y2="44" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
          <line x1="14" y1="-14" x2="-44" y2="44" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* ---- laptop / freelance bottom-center ---- */}
        <g transform="translate(500,700) rotate(6)">
          <rect x="-52" y="-28" width="104" height="68" rx="6" fill="none" stroke="#1d4ed8" strokeWidth="6" />
          <rect x="-40" y="-18" width="80" height="46" rx="3" fill="#1d4ed8" opacity="0.3" />
          <line x1="-70" y1="40" x2="70" y2="40" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="0" cy="40" rx="22" ry="5" fill="#1d4ed8" />
        </g>

        {/* ---- star / trust top-far-right ---- */}
        <g transform="translate(1100,200) rotate(18)">
          <path d="M0,-55 L13,-18 L52,-18 L21,5 L32,42 L0,20 L-32,42 L-21,5 L-52,-18 L-13,-18 Z" fill="#1d4ed8" />
        </g>

        {/* ---- map pin / hyperlocal mid-left ---- */}
        <g transform="translate(150,480) rotate(-6)">
          <path d="M0,-60 C-28,-60 -28,-20 0,-20 C28,-20 28,-60 0,-60 Z" fill="#1d4ed8" />
          <line x1="0" y1="-20" x2="0" y2="40" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
          <circle cx="0" cy="-40" r="10" fill="white" fillOpacity="0.4" />
        </g>

        {/* ---- handshake / community mid-right ---- */}
        <g transform="translate(850,500) rotate(8)">
          <path d="M-50,10 Q-20,-20 0,-10 Q20,-20 50,10" fill="none" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="-50" y1="10" x2="-50" y2="40" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
          <line x1="50" y1="10" x2="50" y2="40" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
          <path d="M-50,40 Q0,60 50,40" fill="none" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* ---- sparkle / health top-center-right ---- */}
        <g transform="translate(760,80) rotate(0)">
          <line x1="0" y1="-44" x2="0" y2="44" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
          <line x1="-44" y1="0" x2="44" y2="0" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
          <line x1="-31" y1="-31" x2="31" y2="31" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
          <line x1="31" y1="-31" x2="-31" y2="31" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      {/* Soft radial glow at hero center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-200/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-green-100/20 rounded-full blur-[90px]" />
    </div>
  )
}
