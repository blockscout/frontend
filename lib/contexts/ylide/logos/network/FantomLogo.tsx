import React from 'react';
import type { CSSProperties } from 'react';

export function FantomLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      style={ style }
      width={ size }
      height={ size }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <defs>
        <mask id="mask499284" x="10" y="6" width="93.1" height="20" maskUnits="userSpaceOnUse">
          <g id="a">
            <path fill="#ffffff" fillRule="evenodd" d="M10,6h93.1V26H10Z"/>
          </g>
        </mask>
      </defs>
      <title>fa</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <circle fill="#13b5ec" cx="16" cy="16" r="16"/>
          <g mask="url(#mask499284)">
            <path
              fill="#ffffff"
              fillRule="evenodd"
              d="M17.2,12.9l3.6-2.1V15Zm3.6,9L16,24.7l-4.8-2.8V17L16,19.8,20.8,17ZM11.2,10.8l3.6,2.1L11.2,15Zm5.4,3.1L20.2,16
			  l-3.6,2.1Zm-1.2,4.2L11.8,16l3.6-2.1Zm4.8-8.3L16,12.2,11.8,9.8,16,7.3ZM10,9.4V22.5l6,3.4,6-3.4V9.4L16,6Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
