import { SVGProps } from "react";

const KaabaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.width || 24}
    height={props.height || 24}
    {...props}
  >
    <defs>
      <linearGradient id="kaabaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c3e50" />
        <stop offset="100%" stopColor="#34495e" />
      </linearGradient>
    </defs>

    {/* Base of Kaaba */}
    <rect x="20" y="30" width="60" height="60" fill="url(#kaabaGradient)" />

    {/* Roof */}
    <rect x="18" y="28" width="64" height="4" fill="#1c2e40" />

    {/* Door */}
    <rect x="45" y="60" width="10" height="20" fill="#d4af37" />

    {/* Black Stone */}
    <circle
      cx="20"
      cy="60"
      r="3"
      fill="#333"
      stroke="#d4af37"
      strokeWidth="1"
    />

    {/* Kiswa details */}
    <line x1="20" y1="40" x2="80" y2="40" stroke="#d4af37" strokeWidth="1" />
    <line x1="20" y1="80" x2="80" y2="80" stroke="#d4af37" strokeWidth="1" />
    <line x1="30" y1="30" x2="30" y2="90" stroke="#d4af37" strokeWidth="1" />
    <line x1="70" y1="30" x2="70" y2="90" stroke="#d4af37" strokeWidth="1" />

    {/* Mataaf (circumambulation area) */}
    <circle
      cx="50"
      cy="60"
      r="45"
      fill="none"
      stroke="#bdc3c7"
      strokeWidth="2"
      strokeDasharray="5,5"
    />
  </svg>
);

export default KaabaIcon;
