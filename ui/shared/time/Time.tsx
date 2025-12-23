import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import dayjs from 'lib/date/dayjs';

interface Props extends BoxProps {
  timestamp: string | number;
  format?: string;
}

const Time = ({ timestamp, format = 'lll', ...rest }: Props) => {
  const settings = useSettingsContext();

  return <chakra.span { ...rest }>{ dayjs(timestamp).utc(settings?.isLocalTime).format(format) }</chakra.span>;
};

export default React.memo(Time);
