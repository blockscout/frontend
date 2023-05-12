import { Skeleton } from '@chakra-ui/react';
import type { TypographyProps } from '@chakra-ui/react';
import React from 'react';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';

interface Props {
  ts: string;
  isEnabled?: boolean;
  isLoading?: boolean;
  fontSize?: TypographyProps['fontSize'];
}

const BlockTimestamp = ({ ts, isEnabled, isLoading, fontSize }: Props) => {
  const timeAgo = useTimeAgoIncrement(ts, isEnabled);

  return (
    <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight={ 400 } fontSize={ fontSize } display="inline-block">
      <span>{ timeAgo }</span>
    </Skeleton>
  );
};

export default React.memo(BlockTimestamp);
