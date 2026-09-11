import type { SVGAttributes } from 'react';

/**
 * SUCOFINDO logo — three globes with wordmark.
 * Brand color gradient: Primary (#035EA9) → Secondary (#0781C4) → Blue (#139FDA)
 */
export default function SucofindoLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 80"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <defs>
                <linearGradient id="globe-grad-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#035EA9" />
                    <stop offset="100%" stopColor="#0781C4" />
                </linearGradient>
                <linearGradient id="globe-grad-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0781C4" />
                    <stop offset="100%" stopColor="#139FDA" />
                </linearGradient>
                <linearGradient id="globe-grad-3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#139FDA" />
                    <stop offset="100%" stopColor="#4DB8E8" />
                </linearGradient>
                <linearGradient id="check-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#035EA9" />
                    <stop offset="100%" stopColor="#00A099" />
                </linearGradient>
            </defs>

            {/* Three globes */}
            <g>
                {/* Globe 1 (left) */}
                <circle cx="60" cy="22" r="16" fill="url(#globe-grad-1)" opacity="0.9" />
                <ellipse cx="60" cy="22" rx="8" ry="16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="44" y1="22" x2="76" y2="22" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="47" y1="14" x2="73" y2="14" stroke="white" strokeWidth="0.6" opacity="0.3" />
                <line x1="47" y1="30" x2="73" y2="30" stroke="white" strokeWidth="0.6" opacity="0.3" />

                {/* Globe 2 (center) */}
                <circle cx="90" cy="22" r="16" fill="url(#globe-grad-2)" opacity="0.9" />
                <ellipse cx="90" cy="22" rx="8" ry="16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="74" y1="22" x2="106" y2="22" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="77" y1="14" x2="103" y2="14" stroke="white" strokeWidth="0.6" opacity="0.3" />
                <line x1="77" y1="30" x2="103" y2="30" stroke="white" strokeWidth="0.6" opacity="0.3" />

                {/* Globe 3 (right) */}
                <circle cx="120" cy="22" r="16" fill="url(#globe-grad-3)" opacity="0.9" />
                <ellipse cx="120" cy="22" rx="8" ry="16" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="104" y1="22" x2="136" y2="22" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <line x1="107" y1="14" x2="133" y2="14" stroke="white" strokeWidth="0.6" opacity="0.3" />
                <line x1="107" y1="30" x2="133" y2="30" stroke="white" strokeWidth="0.6" opacity="0.3" />
            </g>

            {/* Checkmark icon (top right of globes) */}
            <path
                d="M140 8 C142 5, 146 3, 148 6 C144 12, 140 16, 138 14 C136 12, 138 10, 140 8Z"
                fill="url(#check-grad)"
            />

            {/* Wordmark */}
            <text
                x="100"
                y="60"
                textAnchor="middle"
                fontFamily="'Mulish', sans-serif"
                fontWeight="800"
                fontSize="18"
                letterSpacing="4"
                fill="#14141A"
            >
                SUCOFINDO
            </text>
        </svg>
    );
}
