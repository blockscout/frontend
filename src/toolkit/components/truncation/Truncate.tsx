// SPDX-License-Identifier: LicenseRef-Blockscout

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
