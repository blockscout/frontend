import React from 'react';
import type { CSSProperties } from 'react';

export function BinanceWalletLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={ size } height={ size } style={ style } viewBox="0 0 127 127" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.72 53.2L63.31 28.62L87.91 53.22L102.21 38.91L63.31 0L24.41 38.9L38.72 53.2Z" fill="#F3BA2F"/>
      <path
        d="M-0.00512695 63.3071L14.2996 49.0024L28.6044 63.3071L14.2996 77.6119L-0.00512695 63.3071Z"
        fill="#F3BA2F"
      />
      <path
        d="M38.72 73.41L63.31 98L87.91 73.4L102.22 87.69L102.21 87.7L63.31 126.61L24.41 87.72L24.39 87.7L38.72 73.41Z"
        fill="#F3BA2F"
      />
      <path
        d="M97.9913 63.3107L112.296 49.0059L126.601 63.3107L112.296 77.6154L97.9913 63.3107Z"
        fill="#F3BA2F"
      />
      <path
        d="M77.82 63.3L63.31 48.78L52.58 59.51L51.34 60.74L48.8 63.28L48.78 63.3L48.8 63.33L63.31 77.83L77.82 63.31L77.83 63.3H77.82Z"
        fill="#F3BA2F"
      />
    </svg>
  );
}
