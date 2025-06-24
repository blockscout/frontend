import React from 'react';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = {
  // should be string, will be fixed on the back-end
  timestamp: string | number;
  isLoading?: boolean;
  noIcon?: boolean;
};

const DetailedInfoTimestamp = ({ timestamp, isLoading, noIcon }: Props) => {
  return (
    <>
      { !noIcon && <IconSvg name="clock" boxSize={ 5 } color="gray.500" isLoading={ isLoading } mr={ 2 }/> }
      <Skeleton loading={ isLoading }>
        { dayjs(timestamp).fromNow() }
      </Skeleton>
      <TextSeparator color="gray.500"/>
      <Skeleton loading={ isLoading } whiteSpace="normal">
        { dayjs(timestamp).format('llll') }
      </Skeleton>
    </>
  );
};

export default DetailedInfoTimestamp;
