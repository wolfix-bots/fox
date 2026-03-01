"use client";

export function FoxLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Foxy logo"
    >
      {/* Left ear */}
      <path
        d="M20 15 L35 45 L10 50 Z"
        className="fill-primary"
      />
      {/* Right ear */}
      <path
        d="M80 15 L65 45 L90 50 Z"
        className="fill-primary"
      />
      {/* Inner left ear */}
      <path
        d="M24 25 L34 43 L16 46 Z"
        className="fill-accent"
      />
      {/* Inner right ear */}
      <path
        d="M76 25 L66 43 L84 46 Z"
        className="fill-accent"
      />
      {/* Face */}
      <ellipse
        cx="50"
        cy="58"
        rx="32"
        ry="30"
        className="fill-primary"
      />
      {/* White face patch */}
      <ellipse
        cx="50"
        cy="65"
        rx="20"
        ry="20"
        fill="white"
      />
      {/* Left eye */}
      <ellipse cx="40" cy="55" rx="4" ry="4.5" className="fill-foreground" />
      <ellipse cx="41" cy="53.5" rx="1.5" ry="1.5" fill="white" />
      {/* Right eye */}
      <ellipse cx="60" cy="55" rx="4" ry="4.5" className="fill-foreground" />
      <ellipse cx="61" cy="53.5" rx="1.5" ry="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="65" rx="4" ry="3" className="fill-foreground" />
      {/* Mouth */}
      <path
        d="M46 69 Q50 74 54 69"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="stroke-foreground"
      />
    </svg>
  );
}
