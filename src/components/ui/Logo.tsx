interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Outer decorative circles */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        strokeDasharray="2,3"
        opacity="0.6"
      />

      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="1"
        strokeDasharray="1,2"
        opacity="0.4"
      />

      {/* Main circle border */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />

      {/* Letter C */}
      <path
        d="M 60 30 A 20 20 0 1 0 60 70"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Inner decorative elements */}
      <circle cx="50" cy="25" r="1" fill="url(#logoGradient)" opacity="0.7" />
      <circle cx="50" cy="75" r="1" fill="url(#logoGradient)" opacity="0.7" />
      <circle cx="25" cy="50" r="1" fill="url(#logoGradient)" opacity="0.7" />
      <circle cx="75" cy="50" r="1" fill="url(#logoGradient)" opacity="0.7" />
    </svg>
  );
}
