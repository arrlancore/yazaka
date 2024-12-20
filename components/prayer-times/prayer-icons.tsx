export const MagrbIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    style={{ background: "transparent" }} // Add this for debugging
    {...props}
  >
    <defs>
      <radialGradient id="sunset-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="coral" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#FF4500" />
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="sun-shadow">
        <feDropShadow
          dx={0}
          dy={2}
          floodColor="rgba(0,0,0,0.3)"
          stdDeviation={2}
        />
      </filter>
    </defs>

    <circle cx={50} cy={50} r={48} fill="url(#sunset-gradient)" />

    <circle cx={50} cy={60} r={18} fill="gold" filter="url(#sun-shadow)" />

    <g clipPath="url(#circle-clip)">
      <path fill="#FF8C00" d="M0 75q25-10 50 0t50 0v25H0Z" opacity={0.8} />
      <path fill="tomato" d="M0 85q25-10 50 0t50 0v15H0Z" opacity={0.7} />
    </g>
  </svg>
);

export const IsyaIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <radialGradient id="night-sky-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1a237e" /> // Deep blue
        <stop offset="100%" stopColor="#000051" /> // Very dark blue
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="moon-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Night sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#night-sky-gradient)" />

    {/* Stars */}
    <g clipPath="url(#circle-clip)">
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100}
          cy={Math.random() * 100}
          r={Math.random() * 0.8 + 0.2}
          fill="white"
          opacity={Math.random() * 0.5 + 0.5}
        />
      ))}
    </g>

    {/* Crescent moon */}
    <path
      d="M65,40 A20,20 0 1,1 65,60 A15,15 0 1,0 65,40"
      fill="#FFF9C4"
      filter="url(#moon-glow)"
    />

    {/* Horizon waves */}
    <g clipPath="url(#circle-clip)">
      <path fill="#3949ab" d="M0 80q25-5 50 0t50 0v20H0Z" opacity={0.6} /> //
      Slightly lighter blue
      <path fill="#1a237e" d="M0 85q25-5 50 0t50 0v15H0Z" opacity={0.8} /> //
      Darker blue
    </g>
  </svg>
);
export const FajrDawnIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient id="dawn-sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a237e" /> {/* Deep blue for night sky */}
        <stop offset="40%" stopColor="#3949ab" /> {/* Lighter blue */}
        <stop offset="70%" stopColor="#9fa8da" /> {/* Light blue */}
        <stop offset="100%" stopColor="#ffcdd2" /> {/* Pinkish for dawn */}
      </linearGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="star-glow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Dawn sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#dawn-sky-gradient)" />

    <g clipPath="url(#circle-clip)">
      {/* Stars (fewer and dimmer than night) */}
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100}
          cy={Math.random() * 40} // Only in the upper part of the sky
          r={Math.random() * 0.6 + 0.2}
          fill="white"
          opacity={Math.random() * 0.3 + 0.2} // Dimmer stars
          filter="url(#star-glow)"
        />
      ))}

      {/* Crescent moon (smaller and higher) */}
      <path
        d="M75,25 A8,8 0 1,1 75,33 A6,6 0 1,0 75,25"
        fill="#FFF9C4"
        opacity={0.7} // Slightly faded
      />

      {/* Sun peeking from the horizon */}
      <circle cx={50} cy={85} r={15} fill="#FFD54F" />

      {/* Horizon with subtle waves */}
      <path fill="#7986cb" d="M0 75q25-3 50 0t50 0v25H0Z" opacity={0.4} />
      <path fill="#5c6bc0" d="M0 80q25-3 50 0t50 0v20H0Z" opacity={0.5} />
    </g>
  </svg>
);
export const SunriseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient
        id="sunrise-sky-gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#FFB74D" /> {/* Light orange */}
        <stop offset="40%" stopColor="#FFF176" /> {/* Light yellow */}
        <stop offset="100%" stopColor="#E1F5FE" /> {/* Very light blue */}
      </linearGradient>
      <clipPath id="sunrise-circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="sun-glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Sunrise sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#sunrise-sky-gradient)" />

    <g clipPath="url(#sunrise-circle-clip)">
      {/* Sun rising from the horizon */}
      <circle cx={50} cy={75} r={20} fill="#FFD54F" filter="url(#sun-glow)" />

      {/* Subtle sun rays */}
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1={50}
          y1={75}
          x2={50 + Math.cos((i * Math.PI) / 4) * 30}
          y2={75 + Math.sin((i * Math.PI) / 4) * 30}
          stroke="#FFD54F"
          strokeWidth={2}
          opacity={0.6}
        />
      ))}

      {/* Horizon with subtle waves */}
      <path fill="#FFB74D" d="M0 85q25-3 50 0t50 0v15H0Z" opacity={0.6} />
      <path fill="#FFA726" d="M0 90q25-2 50 0t50 0v10H0Z" opacity={0.7} />
    </g>
  </svg>
);
export const SunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" /> {/* Bright yellow */}
        <stop offset="100%" stopColor="#FFA500" /> {/* Orange */}
      </radialGradient>
      <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" /> {/* Sky blue */}
        <stop offset="100%" stopColor="#E0F7FA" /> {/* Light blue */}
      </linearGradient>
      <filter id="sun-glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
    </defs>

    <g clipPath="url(#circle-clip)">
      {/* Sky background */}
      <circle cx={50} cy={50} r={48} fill="url(#sky-gradient)" />

      {/* Sun */}
      <circle
        cx={50}
        cy={50}
        r={20}
        fill="url(#sun-gradient)"
        filter="url(#sun-glow)"
      />

      {/* Improved sun rays */}
      <g opacity="0.7">
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const innerRadius = 22;
          const outerRadius = 35;
          const x1 = 50 + Math.cos(angle) * innerRadius;
          const y1 = 50 + Math.sin(angle) * innerRadius;
          const x2 = 50 + Math.cos(angle) * outerRadius;
          const y2 = 50 + Math.sin(angle) * outerRadius;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD54F"
              strokeWidth={i % 2 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Wave-like clouds */}
      <path
        d="M0 75 Q25 65, 50 75 T100 75 V100 H0 Z"
        fill="#EFFFFE"
        opacity={0.6}
      />
      <path
        d="M0 80 Q25 70, 50 80 T100 80 V100 H0 Z"
        fill="#EFFFFE"
        opacity={0.8}
      />
    </g>
  </svg>
);
export const AfternoonSunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient
        id="afternoon-sky-gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#FFB74D" /> {/* Light orange */}
        <stop offset="100%" stopColor="#FFECB3" /> {/* Very light orange */}
      </linearGradient>
      <radialGradient id="afternoon-sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD54F" /> {/* Bright yellow */}
        <stop offset="100%" stopColor="#FFA726" /> {/* Orange */}
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
    </defs>

    {/* Sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#afternoon-sky-gradient)" />

    {/* Clipped content */}
    <g clipPath="url(#circle-clip)">
      {/* Simple sun */}
      <circle cx={50} cy={75} r={15} fill="url(#afternoon-sun-gradient)" />

      {/* Horizon with subtle waves */}
      <path fill="#FFB74D" d="M0 85q25-3 50 0t50 0v15H0Z" opacity={0.4} />
      <path fill="#FFA726" d="M0 90q25-2 50 0t50 0v10H0Z" opacity={0.5} />
    </g>
  </svg>
);
