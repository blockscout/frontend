import React from 'react';
import type { CSSProperties } from 'react';

export function ArbitrumLogo({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      version="1.1"
      width={ size }
      height={ size }
      style={ style }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 323"
      fill="none"
    >
      <path
        d="M180.303 147.838L203.968 107.684L267.753 207.032L267.783 226.097L267.575 94.9C267.424 91.693 265.721 88.759 263.004
		87.029L148.167 20.973C145.481 19.653 142.074 19.667 139.393
		21.014C139.031 21.196 138.69 21.393 138.365 21.608L137.965 21.86L26.497 86.455L26.064 86.651C25.508 86.907 24.946 87.232
		24.418 87.61C22.305 89.126 20.901 91.367 20.447 93.881C20.379 94.262 20.329 94.65 20.305 95.041L20.48 201.954L79.893
		109.867C87.373 97.656 103.671 93.723 118.8 93.937L136.557 94.406L31.933 262.193L44.266 269.294L150.144 94.576L196.942
		94.406L91.337 273.533L135.345 298.845L140.603 301.869C142.827 302.773 145.449 302.818 147.692 302.009L264.143 234.524L241.879
		247.425L180.303 147.838ZM189.332 277.877L144.883 208.115L172.016 162.073L230.391 254.082L189.332 277.877Z"
        fill="#2D374B"
      />
      <path
        d="M144.883 208.115L189.332 277.877L230.392 254.082L172.017 162.073L144.883 208.115Z"
        fill="#28A0F0"
      />
      <path
        d="M267.783 226.097L267.753 207.032L203.968 107.684L180.303 147.838L241.879 247.425L264.143 234.524C266.327 232.751 267.648
		230.148 267.787 227.339L267.783 226.097Z"
        fill="#28A0F0"
      />
      <path
        d="M0.492004 244.077L31.932 262.193L136.556 94.406L118.799 93.937C103.67 93.723 87.373 97.656 79.892 109.867L20.479
		201.954L0.490997 232.665V244.077H0.492004Z"
        fill="white"
      />
      <path
        d="M196.941 94.406L150.144 94.576L44.266 269.294L81.273 290.602L91.337 273.533L196.941 94.406Z"
        fill="white"
      />
      <path
        d="M287.504 94.165C287.113 84.378 281.814 75.418 273.513 70.202L157.171 3.297C148.96 -0.838001 138.702 -0.843004 130.478
		3.294C129.506 3.784 17.337 68.838 17.337 68.838C15.785 69.582 14.29 70.469 12.883 71.475C5.473 76.786 0.956004 85.038
		0.492004 94.105V232.666L20.48 201.955L20.305 95.042C20.329 94.651 20.378 94.267 20.447 93.887C20.898 91.371 22.303 89.127
		24.418 87.611C24.946 87.233 139.03 21.197 139.393 21.015C142.075 19.668 145.482 19.654 148.167 20.974L263.004 87.03C265.721
		88.76 267.424 91.694 267.575 94.901V227.34C267.436 230.149 266.326 232.751 264.142 234.525L241.878 247.426L230.391
		254.083L189.331 277.878L147.691 302.01C145.448 302.82 142.826 302.775 140.602 301.87L91.336 273.534L81.272 290.602L125.546
		316.093C127.01 316.925 128.315 317.663 129.385 318.265C131.043 319.195 132.172 319.816 132.571 320.009C135.718 321.537
		140.245 322.427 144.325 322.427C148.066 322.427 151.713 321.74 155.165 320.388L276.11 250.345C283.052 244.967 287.136 236.856
		287.504 228.069V94.165V94.165Z"
        fill="#96BEDC"
      />
    </svg>
  );
}
