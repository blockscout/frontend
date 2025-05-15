import { chakra } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

type Props = {
  timestamp?: string | number | null;
  fallbackText?: string;
  isLoading?: boolean;
  enableIncrement?: boolean;
  className?: string;
};

const TimeAgoWithTooltip = ({ timestamp, fallbackText, isLoading, enableIncrement, className }: Props) => {
  const timeAgo = useTimeAgoIncrement(timestamp || '', enableIncrement && !isLoading);
  if (!timestamp && !fallbackText) {
    return null;
  }

  const content = timestamp ?
    <Tooltip content={ dayjs(timestamp).format('llll') }><span>{ timeAgo }</span></Tooltip> :
    <span>{ fallbackText }</span>;

  return (
    <Skeleton loading={ isLoading } className={ className }>
      { content }
    </Skeleton>
  );
};

export default chakra(TimeAgoWithTooltip);
