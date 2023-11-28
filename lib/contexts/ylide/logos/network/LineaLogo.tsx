import React from 'react';
import type { CSSProperties } from 'react';

export function LineaLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      version="1.1"
      width={ size }
      height={ size }
      style={ style }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 32"
      fill="black"
    >
      <path d="M24.1354 31.212H0V5.50317H5.52221V26.2295H24.1354V31.212Z"/>
      <path d="M24.1353 10.483C26.8558 10.483 29.0612 8.25344 29.0612 5.50319C29.0612 2.75295 26.8558 0.523438 24.1353
      0.523438C21.4149 0.523438 19.2095 2.75295 19.2095 5.50319C19.2095 8.25344 21.4149 10.483 24.1353 10.483Z"/>
    </svg>
  );
}
