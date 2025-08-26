import React from 'react';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import TextSeparator from 'ui/shared/TextSeparator';

import TruncatedValue from '../TruncatedValue';

type Props = {
  // should be string, will be fixed on the back-end
  timestamp: string | number;
  isLoading?: boolean;
  noIcon?: boolean;
};

const DetailedInfoTimestamp = ({ timestamp, isLoading, noIcon }: Props) => {
  return (
    <>
      { !noIcon && <IconSvg name="clock" boxSize={ 5 } color="icon.primary" isLoading={ isLoading } mr={{ base: 1, lg: 2 }}/> }
      <Skeleton loading={ isLoading }>
        { dayjs(timestamp).fromNow() }
      </Skeleton>
      <TextSeparator mx={ 2 }/>
      <TruncatedValue
        value={ dayjs(timestamp).format('llll') }
        isLoading={ isLoading }
      />
    </>
  );
};

export default DetailedInfoTimestamp;
