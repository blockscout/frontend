// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'src/shell/top-bar/settings/context';
import type { TimeFormat } from 'src/shell/top-bar/settings/time-format/utils';

import dayjs from 'src/shared/date-and-time/dayjs';
import useTimeAgoIncrement from 'src/shared/date-and-time/useTimeAgoIncrement';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  timestamp?: string | number | null;
  fallbackText?: string;
  isLoading?: boolean;
  enableIncrement?: boolean;
  className?: string;
  timeFormat?: TimeFormat;
};

// Tooltip content is rendered only when the tooltip opens, so wrapping the dayjs call
// in a component defers the parsing/formatting until the first hover — otherwise every
// timestamp cell of a table pays for it during the initial render.
const TimestampTooltipContent = ({ timestamp, isLocalTime }: { timestamp: string | number; isLocalTime?: boolean }) => {
  return isLocalTime ? dayjs(timestamp).format('llll') : dayjs(timestamp).utc().format('llll');
};

const TimeWithTooltip = ({ timestamp, fallbackText, isLoading, enableIncrement, className, timeFormat: timeFormatProp }: Props) => {
  const settings = useSettingsContext();
  const timeFormat = timeFormatProp || settings?.timeFormat || 'relative';
  const timeAgo = useTimeAgoIncrement(timestamp || '', enableIncrement && !isLoading && timeFormat === 'relative');

  if (!timestamp && !fallbackText) {
    return null;
  }

  const content = (() => {
    if (!timestamp) {
      return fallbackText;
    }

    if (timeFormat === 'relative') {
      const content = <TimestampTooltipContent timestamp={ timestamp } isLocalTime={ settings?.isLocalTime }/>;
      return <Tooltip content={ content }><span>{ timeAgo }</span></Tooltip>;
    }

    return <Tooltip content={ timeAgo }><span>{ dayjs(timestamp).utc(settings?.isLocalTime).format('lll') }</span></Tooltip>;
  })();

  return (
    <Skeleton loading={ isLoading } className={ className }>
      { content }
    </Skeleton>
  );
};

export default chakra(TimeWithTooltip);
