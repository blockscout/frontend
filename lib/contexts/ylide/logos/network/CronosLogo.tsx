import React from 'react';
import type { CSSProperties } from 'react';

export function CronosLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={ size }
      height={ size }
      style={ style }
      viewBox="0 0 2167.7 2502.5"
      enableBackground="new 0 0 2167.7 2502.5"
    >
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="795.8919"
        y1="1699.9476"
        x2="795.8919"
        y2="1608.7477"
        gradientTransform="matrix(27.4398 0 0 -27.4398 -20755.2402 46646.2188)"
      >
        <stop offset="0" stopColor="#25376C"/>
        <stop offset="1" stopColor="#1F1F49"/>
      </linearGradient>
      <path fill="url(#SVGID_1_)" d="M1083.9,0L0,625.6v1251.3l1083.9,625.6l1083.9-625.6V625.6L1083.9,0z"/>
      <linearGradient
        id="SVGID_00000007418222533405911760000015435408293652292017_"
        gradientUnits="userSpaceOnUse"
        x1="776.1419"
        y1="1608.7477"
        x2="776.1419"
        y2="1699.9476"
        gradientTransform="matrix(27.4398 0 0 -27.4398 -20755.2402 46646.2188)"
      >
        <stop offset="0" stopColor="#25376C"/>
        <stop offset="1" stopColor="#1F1F49"/>
      </linearGradient>
      <path
        fill="url(#SVGID_00000007418222533405911760000015435408293652292017_)"
        d="M1083.9,0L0,625.6v1251.3l1083.9,625.6V0z"
      />
      <path
        fill="#FFFFFF"
        d="M1506.4,540.6H655.8L557,974.1h1053.7L1506.4,540.6z M806.7,1569.6v-288.1l-252.4-159.2l-285.4,211.3
	l389.6,677.8H815l183.8-172.9v-85.1L806.7,1569.6z"
      />
      <path fill="#FFFFFF" d="M1358.3,1040H809.5l90.6,241.5l-27.4,271.7h422.6l-27.4-271.7L1358.3,1040z"/>
      <path
        fill="#FFFFFF"
        d="M1610.7,1119.5L1361,1281.4v288.1l-189.3,183.8v85.1l183.8,170.1h153.7l386.9-675L1610.7,1119.5z"
      />
    </svg>
  );
}
