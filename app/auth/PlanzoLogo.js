export default function PlanzoLogo({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 300"
      className={className}
    >
      <defs>
        <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0ea5e9", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <g transform="translate(200, 110)">
        <path
          d="M -60,20 Q -90,20 -90,-5 Q -90,-30 -65,-30 Q -65,-60 -30,-60 Q -10,-75 15,-60 Q 30,-75 55,-60 Q 80,-55 75,-30 Q 90,-25 85,0 Q 80,20 55,20 Z"
          fill="none"
          stroke="url(#purpleBlueGrad)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M -55,25 Q 10,60 80,5"
          fill="none"
          stroke="url(#planeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g transform="translate(82, 2) rotate(-30)">
          <ellipse cx="0" cy="0" rx="14" ry="5" fill="url(#planeGrad)" />
          <polygon points="-4,-4 -14,12 8,4" fill="url(#planeGrad)" />
          <polygon points="-10,-3 -18,-10 -4,-2" fill="url(#planeGrad)" />
          <polygon points="12,-1 20,1 12,3" fill="url(#planeGrad)" />
        </g>
      </g>

      <text
        x="200"
        y="210"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="bold"
        fill="url(#textGrad)"
        letterSpacing="2"
      >
        Planzo
      </text>

      <text
        x="200"
        y="240"
        textAnchor="middle"
        fontFamily="'Trebuchet MS', Arial, sans-serif"
        fontSize="12"
        fill="#94a3b8"
        letterSpacing="4"
      >
        • ALL PLANS. ONE JOURNEY. •
      </text>
    </svg>
  );
}