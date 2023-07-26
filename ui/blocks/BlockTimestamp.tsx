import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';

interface Props {
  ts: string;
  isEnabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

const BlockTimestamp = ({ ts, isEnabled, isLoading, className }: Props) => {
  const timeAgo = useTimeAgoIncrement(ts, isEnabled);

  return (
    <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight={ 400 } className={ className } display="inline-block">
      <span>{ timeAgo }</span>
    </Skeleton>
  );
};

export default React.memo(chakra(BlockTimestamp));
