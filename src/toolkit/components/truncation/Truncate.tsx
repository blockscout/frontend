// SPDX-License-Identifier: LicenseRef-Blockscout

// The public text-truncation primitive. App code picks *what* to show (`value`) and *how*
// (`type`); the implementation is chosen per-type and lives in a small internal module:
//   - `middle` (default) — measured middle-ellipsis (container width, binary search)
//   - `middle-static`     — fixed char count, pure string slice, SSR-safe, cheapest
//   - `end`               — measured end-ellipsis (CSS text-overflow)

import React from 'react';

import { TruncateEnd } from './TruncateEnd';
import type { TruncateEndProps } from './TruncateEnd';
import { TruncateMiddle } from './TruncateMiddle';
import type { TruncateMiddleProps } from './TruncateMiddle';
import { TruncateMiddleStatic } from './TruncateMiddleStatic';
import type { TruncateMiddleStaticProps } from './TruncateMiddleStatic';

export type { TruncateTooltipConfig } from './types';

interface TruncatePropsMiddle extends TruncateMiddleProps {
  type?: 'middle';
}

interface TruncatePropsMiddleStatic extends TruncateMiddleStaticProps {
  type: 'middle-static';
}

interface TruncatePropsEnd extends TruncateEndProps {
  type: 'end';
}

export type TruncateProps = TruncatePropsMiddle | TruncatePropsMiddleStatic | TruncatePropsEnd;

export const Truncate = (props: TruncateProps) => {
  switch (props.type) {
    case 'end': {
      const { type, ...rest } = props;
      return <TruncateEnd { ...rest }/>;
    }
    case 'middle-static': {
      const { type, ...rest } = props;
      return <TruncateMiddleStatic { ...rest }/>;
    }
    case 'middle':
    default: {
      const { type, ...rest } = props;
      return <TruncateMiddle { ...rest }/>;
    }
  }
};
