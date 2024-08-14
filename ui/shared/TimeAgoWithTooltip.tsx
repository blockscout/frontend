import { Skeleton, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';

type Props = {
  timestamp?: string | number | null;
  fallbackText?: string;
  isLoading?: boolean;
  enableIncrement?: boolean;
  className?: string;
}

const TimeAgoWithTooltip = ({ timestamp, fallbackText, isLoading, enableIncrement, className }: Props) => {
  const timeAgo = useTimeAgoIncrement(timestamp || '', enableIncrement && !isLoading);
  if (!timestamp && !fallbackText) {
    return null;
  }

  const content = timestamp ?
    <Tooltip label={ dayjs(timestamp).format('llll') }><span>{ timeAgo }</span></Tooltip> :
    <span>{ fallbackText }</span>;

  return (
    <Skeleton isLoaded={ !isLoading } className={ className }>
      { content }
    </Skeleton>
  );
};

export default chakra(TimeAgoWithTooltip);
