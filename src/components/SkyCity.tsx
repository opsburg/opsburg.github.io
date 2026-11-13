/** The hero illustration: three floating islands, a clocktower, boilers and an airship. */
export default function SkyCity() {
  return (
    <svg viewBox="0 0 640 420" role="img" aria-labelledby="sky-city-title" className="w-full h-auto">
      <title id="sky-city-title">A steampunk city floating on islands in the clouds, with an airship approaching</title>
      <defs>
        <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b4a3a" />
          <stop offset="1" stopColor="#2a2119" />
        </linearGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d27a" />
          <stop offset="0.5" stopColor="#c9a227" />
          <stop offset="1" stopColor="#b87333" />
        </linearGradient>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e1d3" />
          <stop offset="1" stopColor="#a89f8c" />
        </linearGradient>
      </defs>

      {/* clouds */}
      <g fill="#e8e1d3" opacity="0.12">
        <ellipse cx="120" cy="330" rx="140" ry="28" />
        <ellipse cx="480" cy="360" rx="170" ry="30" />
        <ellipse cx="330" cy="395" rx="200" ry="22" />
      </g>

      {/* main island */}
      <g className="animate-drift">
        <path d="M200 250 Q330 230 460 250 L420 300 Q380 360 330 380 Q280 360 240 300 Z" fill="url(#rock)" />
        <rect x="205" y="240" width="250" height="14" rx="6" fill="#4d6b3c" />
        {/* clocktower */}
        <rect x="312" y="120" width="36" height="122" fill="#3b2f25" stroke="url(#brass)" strokeWidth="2" />
        <path d="M306 122 L330 88 L354 122 Z" fill="url(#brass)" />
        <circle cx="330" cy="150" r="13" fill="#f4ecd8" stroke="url(#brass)" strokeWidth="3" />
        <path d="M330 150 L330 141 M330 150 L337 153" stroke="#3b2f25" strokeWidth="2" strokeLinecap="round" />
        {/* boiler houses */}
        <rect x="240" y="196" width="54" height="46" fill="#4a3a2c" stroke="url(#brass)" strokeWidth="1.5" />
        <rect x="252" y="170" width="10" height="28" fill="#2a2119" />
        <rect x="270" y="178" width="10" height="20" fill="#2a2119" />
        <rect x="366" y="204" width="70" height="38" fill="#4a3a2c" stroke="url(#brass)" strokeWidth="1.5" />
        <g fill="#f1d27a" opacity="0.85">
          <rect x="250" y="212" width="8" height="10" />
          <rect x="276" y="212" width="8" height="10" />
          <rect x="378" y="216" width="8" height="10" />
          <rect x="398" y="216" width="8" height="10" />
          <rect x="418" y="216" width="8" height="10" />
        </g>
        {/* steam */}
        <g fill="#e8e1d3" opacity="0.35">
          <circle cx="257" cy="160" r="8" />
          <circle cx="263" cy="146" r="10" />
          <circle cx="275" cy="168" r="6" />
        </g>
        {/* gear */}
        <g className="animate-spin-slow">
          <circle cx="430" cy="185" r="14" fill="none" stroke="url(#brass)" strokeWidth="5" strokeDasharray="6 4" />
          <circle cx="430" cy="185" r="5" fill="url(#brass)" />
        </g>
      </g>

      {/* left island: observatory */}
      <g className="animate-drift" style={{ animationDelay: "1.5s" }}>
        <path d="M40 200 Q100 188 160 200 L140 228 Q100 262 60 228 Z" fill="url(#rock)" />
        <rect x="44" y="192" width="112" height="9" rx="4" fill="#4d6b3c" />
        <rect x="82" y="160" width="36" height="34" fill="#4a3a2c" stroke="url(#brass)" strokeWidth="1.5" />
        <path d="M78 162 Q100 132 122 162 Z" fill="url(#brass)" />
        <line x1="104" y1="146" x2="128" y2="130" stroke="#e8e1d3" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* right island: lightning spire */}
      <g className="animate-drift" style={{ animationDelay: "3s" }}>
        <path d="M500 160 Q550 150 600 160 L585 185 Q550 215 515 185 Z" fill="url(#rock)" />
        <rect x="504" y="153" width="92" height="9" rx="4" fill="#4d6b3c" />
        <path d="M546 154 L552 80 L558 154 Z" fill="url(#brass)" />
        <path d="M562 70 L548 96 L558 96 L546 120" fill="none" stroke="#f1d27a" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* airship */}
      <g className="animate-drift" style={{ animationDelay: "0.8s" }}>
        <ellipse cx="160" cy="70" rx="70" ry="22" fill="url(#hull)" />
        <path d="M95 70 L230 70" stroke="#a89f8c" strokeWidth="1.5" />
        <path d="M222 60 L246 50 L246 90 L222 80 Z" fill="url(#brass)" />
        <rect x="138" y="98" width="46" height="14" rx="3" fill="#4a3a2c" stroke="url(#brass)" strokeWidth="1.5" />
        <path d="M140 90 L146 98 M182 90 L176 98" stroke="#a89f8c" strokeWidth="1.5" />
        <g className="animate-spin-slow">
          <circle cx="132" cy="105" r="6" fill="none" stroke="url(#brass)" strokeWidth="3" strokeDasharray="3 2" />
        </g>
      </g>
    </svg>
  );
}
