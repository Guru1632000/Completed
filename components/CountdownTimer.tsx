import React from 'react';

interface CountdownTimerProps {
  timeLeft: number;
  initialTime: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft, initialTime }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.max(0, initialTime > 0 ? timeLeft / initialTime : 0);
  const strokeDashoffset = circumference - progress * circumference;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const timerDisplay = initialTime >= 3600
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isCritical = timeLeft > 0 && timeLeft < 60;
  const isWarning = timeLeft > 0 && progress <= 0.5 && !isCritical;

  const getTheme = () => {
    if (isCritical) return { gradient: 'url(#timer-grad-red)', glow: '#ef4444' };
    if (isWarning) return { gradient: 'url(#timer-grad-amber)', glow: '#f59e0b' };
    return { gradient: 'url(#timer-grad-purple)', glow: '#a855f7' };
  };

  const theme = getTheme();

  return (
    <div className={`relative flex flex-col items-center justify-center w-[120px] h-[120px] ${isCritical ? 'timer-critical-pulse' : ''}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="-rotate-90"
      >
        <defs>
            <linearGradient id="timer-grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="timer-grad-amber" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="timer-grad-red" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="timer-glow">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={theme.glow} />
            </filter>
        </defs>
        
        {/* Background track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.07)"
        />

        {/* Progress ring */}
        <circle
          stroke={theme.gradient}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease-in-out' 
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          filter="url(#timer-glow)"
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center pointer-events-none">
        <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Time Left</span>
        <span 
            className="font-mono text-3xl font-bold text-white tracking-tighter mt-1" 
            style={{ textShadow: `0 0 10px ${theme.glow}` }}
        >
            {timerDisplay}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;