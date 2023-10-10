import React from 'react';
import type { CSSProperties } from 'react';

export function ZetaLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      version="1.1"
      width={ size }
      height={ size }
      style={ style }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 30"
      fill="#235643"
    >
      <path d="M20.6133 21.6881V25.6013H4.46992C4.69261 23.0259 5.52366 21.2137 8.39763 18.6657L20.6133
      8.24448V17.3893H25.0106V0.564941H0.00484107V8.95128H4.40053V4.96224H17.6844L5.5285 15.335L5.49945 15.3625C0.405036
      19.8727 0 23.5132 0 27.8024V30.0002H25.0089V21.6897H20.6116L20.6133 21.6881Z"/>
    </svg>
  );
}
