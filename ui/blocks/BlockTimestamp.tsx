import { Text } from '@chakra-ui/react';
import React from 'react';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';

interface Props {
  ts: string;
  isEnabled?: boolean;
}

const BlockTimestamp = ({ ts, isEnabled }: Props) => {
  const timeAgo = useTimeAgoIncrement(ts, isEnabled);

  return <Text variant="secondary" fontWeight={ 400 }>{ timeAgo }</Text>;
};

export default React.memo(BlockTimestamp);
