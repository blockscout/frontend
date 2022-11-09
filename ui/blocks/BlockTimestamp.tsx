import { Text } from '@chakra-ui/react';
import type { TypographyProps } from '@chakra-ui/react';
import React from 'react';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';

interface Props {
  ts: string;
  isEnabled?: boolean;
  fontSize?: TypographyProps['fontSize'];
}

const BlockTimestamp = ({ ts, isEnabled, fontSize }: Props) => {
  const timeAgo = useTimeAgoIncrement(ts, isEnabled);

  return <Text variant="secondary" fontWeight={ 400 } fontSize={ fontSize }>{ timeAgo }</Text>;
};

export default React.memo(BlockTimestamp);
