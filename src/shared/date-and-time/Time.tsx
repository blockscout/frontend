// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'src/shell/top-bar/settings/context';

import dayjs, { FORMATS } from 'src/shared/date-and-time/dayjs';

interface Props extends BoxProps {
  timestamp: string | number;
  format?: string;
}

const Time = ({ timestamp, format = 'lll', ...rest }: Props) => {
  const settings = useSettingsContext();
  const formatStr = FORMATS[format as keyof typeof FORMATS] || format;
  // `.utc(true)` keeps the local wall clock but reports a zero offset, which breaks the formats that print the offset
  const date = settings?.isLocalTime ? dayjs(timestamp) : dayjs(timestamp).utc();
  return <chakra.span { ...rest }>{ date.format(formatStr) }</chakra.span>;
};

export default React.memo(Time);
