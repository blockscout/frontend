import React from 'react';
import type { CSSProperties } from 'react';

export function AuroraLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      enableBackground="new 0 0 236.9 226.1"
      viewBox="0 0 236.9 226.1"
      width={ size }
      height={ size }
      style={ style }
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1="120.283"
        x2="229.3247"
        y1="114.1049"
        y2="114.1049"
      >
        <stop offset="0" stopColor="#3b8270"/>
        <stop offset="1" stopColor="#305c6e"/>
      </linearGradient>
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="6.4424" x2="116.8247" y1="114.1049" y2="114.1049">
        <stop offset="0" stopColor="#4e7f98"/>
        <stop offset="1" stopColor="#3bc0b5"/>
      </linearGradient>
      <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="6.4424" x2="116.8247" y1="177.7907" y2="177.7907">
        <stop offset="0" stopColor="#30435c"/>
        <stop offset="1" stopColor="#299aa9"/>
      </linearGradient>
      <linearGradient
        id="d"
        gradientUnits="userSpaceOnUse"
        x1="121.1232"
        x2="229.3247"
        y1="176.9844"
        y2="176.9844"
      >
        <stop offset="0" stopColor="#2e2c29"/>
        <stop offset="1" stopColor="#323232"/>
      </linearGradient>
      <path
        d="m235.4 141.5-113.2 83.7c-1.5 1.1-3.7 1.2-5.2.1l-115-81.3c-2.2-1.6-2.7-4.8-.9-6.9l113.1-135.6c1.6-2 4.6-2 6.3 0l115.5 134.8c1.3 1.6 1.1 4-.6 5.2z"
        fill="#fff4fc"
      />
      <path d="m229.3 138.7-107.6 79.5-.6-81-.8-127.2 106.5 125.7z" fill="url(#a)"/>
      <path d="m6.4 140.4 110.4 77.8-2.5-208.2z" fill="url(#b)"/>
      <path d="m115.9 137.4-108.7 2.1-.8.9 110.4 77.8z" fill="url(#c)"/>
      <path d="m121.1 137.2 105.7-1.5 2.5 3-107.6 79.5z" fill="url(#d)"/>
      <path
        d="m121.1 136.2 105.7-1.5m-110.9 1.7-108.7 2.1m108.2-37.6c-23.4-17.9-33.3-20.7-37-17.7-10.2 8.5 27.6 63.8 12.5 77.7-4.4
		4-13.5 4.9-31 6.6-5.4.5-9.9.7-12.8.7m109.7-32.5-35.9-31.4m-23.7-74.6c-.3 4.9-.1 14.6 4.9 25.3 4 8.6 9.5 14.2 13 17.3m85.8
		86.4c.9-1.3 12.1-17.8
		5.2-33.3-5.1-11.5-17.6-16.8-19.5-17.6-2.5-1.1-2.6-.8-14.3-4.6-7.1-2.4-10.7-3.5-13.8-4.7-4.8-1.8-14.1-5.4-24.7-12.2-3.5-2.2-8-5.4-13.1-9.6"
        fill="none"
        stroke="#98c9c0"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </svg>
  );
}
