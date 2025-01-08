interface IconProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const PrayerScheduleIcon = ({
  size = 24,
  primaryColor = "#34D399",
  secondaryColor = "#00d1a0",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ background: "transparent" }}
  >
    <defs>
      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primaryColor} />
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx={50} cy={50} r={45} fill="url(#icon-gradient)" />

    {/* Minimalist Mosque */}
    <path
      d="M35 65 Q50 40 65 65 L67 65 Q50 38 33 65 Z"
      fill="#ffffff"
      opacity={0.9}
    />

    {/* Prayer Time Dots */}
    <g transform="translate(50 50)">
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <circle
          key={i}
          cx={0}
          cy={-35}
          r={2}
          fill="#ffffff"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>

    {/* Minimalist Clock Hand */}
    <g transform="translate(50 50)">
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={-30}
        stroke="#ffffff"
        strokeWidth={2.5}
        strokeLinecap="round"
        transform="rotate(45)"
      />
    </g>

    {/* Center Dot */}
    <circle cx={50} cy={50} r={2.5} fill="#ffffff" />
  </svg>
);

export const QuranIcon = ({
  size = 24,
  primaryColor = "#34D399",
  secondaryColor = "#00d1a0",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ background: "transparent" }}
  >
    <defs>
      <linearGradient
        id="icon-gradient-quran"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor={primaryColor} />
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx={50} cy={50} r={45} fill="url(#icon-gradient-quran)" />

    {/* Minimalist Book */}
    <g transform="translate(50 50)">
      {/* Book Shape */}
      <path
        d="M-20 -15 L20 -15 C22 -15 22 -13 22 -10 L22 15 C22 18 20 18 17 18 
           L-17 18 C-20 18 -22 18 -22 15 L-22 -10 C-22 -13 -22 -15 -20 -15"
        fill="#ffffff"
        opacity={0.9}
      />

      {/* Center Line */}
      <line
        x1={0}
        y1={-15}
        x2={0}
        y2={18}
        stroke={primaryColor}
        strokeWidth={1}
        opacity={0.5}
      />

      {/* Text Lines - Left */}
      <g transform="translate(-15 0)">
        <line
          x1={0}
          y1={-5}
          x2={10}
          y2={-5}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={0}
          y1={0}
          x2={8}
          y2={0}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={0}
          y1={5}
          x2={9}
          y2={5}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
      </g>

      {/* Text Lines - Right */}
      <g transform="translate(5 0)">
        <line
          x1={0}
          y1={-5}
          x2={10}
          y2={-5}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={0}
          y1={0}
          x2={8}
          y2={0}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
        <line
          x1={0}
          y1={5}
          x2={9}
          y2={5}
          stroke={primaryColor}
          strokeWidth={1.5}
          opacity={0.5}
        />
      </g>
    </g>
  </svg>
);

export const QiblaCompassIcon = ({
  size = 24,
  primaryColor = "#34D399",
  secondaryColor = "#00d1a0",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ background: "transparent" }}
  >
    <defs>
      <linearGradient id="compass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primaryColor} />
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx={50} cy={50} r={45} fill="url(#compass-gradient)" />

    {/* Compass Ring */}
    <circle
      cx={50}
      cy={50}
      r={38}
      fill="none"
      stroke="#ffffff"
      strokeWidth={2}
      opacity={0.9}
    />

    {/* Cardinal Points */}
    <g transform="translate(50 50)">
      {["N", "E", "S", "W"].map((dir, i) => (
        <g key={i} transform={`rotate(${i * 90})`}>
          <circle cx={0} cy={-32} r={2} fill="#ffffff" />
        </g>
      ))}
    </g>

    {/* Compass Needle */}
    <g transform="translate(50 50)">
      {/* North pointer */}
      <path d="M0,-25 L4,-8 L0,-10 L-4,-8 Z" fill="#ffffff" opacity={0.9} />
      {/* South pointer */}
      <path d="M0,25 L4,8 L0,10 L-4,8 Z" fill="#ffffff" opacity={0.7} />
      {/* Center dot */}
      <circle cx={0} cy={0} r={3} fill="#ffffff" />
    </g>

    {/* Qibla Indicator */}
    <g transform="translate(50 50) rotate(45)">
      <circle cx={0} cy={-32} r={3} fill="#ffffff" />
    </g>
  </svg>
);

export const DuaIcon = ({
  size = 24,
  primaryColor = "#34D399",
  secondaryColor = "#00d1a0",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ background: "transparent" }}
  >
    <defs>
      <linearGradient id="dua-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primaryColor} />
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx={50} cy={50} r={45} fill="url(#dua-gradient)" />

    {/* Simplified Praying Hands - New Design */}
    <g transform="translate(50, 50)">
      {/* Left Palm */}
      <path
        d="M-20,0 
           C-20,-15 -15,-25 -8,-25 
           C-4,-25 -2,-20 -2,-15
           L-2,5 
           C-2,12 -8,15 -12,15
           C-18,15 -20,10 -20,0"
        fill="#ffffff"
        opacity={0.9}
      />

      {/* Right Palm */}
      <path
        d="M20,0 
           C20,-15 15,-25 8,-25 
           C4,-25 2,-20 2,-15
           L2,5 
           C2,12 8,15 12,15
           C18,15 20,10 20,0"
        fill="#ffffff"
        opacity={0.9}
      />

      {/* Center Light Effect */}
      <path
        d="M-2,-15 
           C-2,-18 -1,-20 0,-20 
           C1,-20 2,-18 2,-15
           L2,5 
           C2,8 1,10 0,10
           C-1,10 -2,8 -2,5 Z"
        fill="#ffffff"
        opacity={0.4}
      />
    </g>

    {/* Prayer Beads - Made Simpler */}
    <g transform="translate(50, 50)">
      <path
        d="M-15,25 Q0,32 15,25"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Three Dots representing beads */}
      <circle cx={-15} cy={25} r={2} fill="#ffffff" opacity={0.7} />
      <circle cx={0} cy={28} r={2} fill="#ffffff" opacity={0.7} />
      <circle cx={15} cy={25} r={2} fill="#ffffff" opacity={0.7} />
    </g>
  </svg>
);

// memorization Icon Component (like a bulb)
export const MemorizationIcon = ({
  size = 24,
  primaryColor = "#34D399",
  secondaryColor = "#00d1a0",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ background: "transparent" }}
  >
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primaryColor} />
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx={50} cy={50} r={45} fill="url(#bg-gradient)" />

    {/* Bulb Outline */}
    <path
      d="M50 30
         Q62 30 68 40
         Q74 50 70 60
         Q66 70 58 73
         L58 76
         Q58 79 54 79
         L46 79
         Q42 79 42 76
         L42 73
         Q34 70 30 60
         Q26 50 32 40
         Q38 30 50 30"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
    />

    {/* Crescent Moon */}
    <path
      d="M55 45
         A 12 12 0 0 0 47 65
         A 15 15 0 0 1 55 45"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
    />

    {/* Base */}
    <path
      d="M42 79 L58 79 M45 82 L55 82"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
