import React from 'react';

const CircularProgress = ({ size = 100, strokeWidth = 10, percentage = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} >
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#4caf50"  // green color, change as needed
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        fontSize="1.5em"
        fill="#333"
      >
        {percentage.toFixed(2)}%
      </text>
    </svg>
  );
};

export default CircularProgress;
