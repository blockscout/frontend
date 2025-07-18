import type { BoxProps } from '@chakra-ui/react';
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
  // TODO @tom2drum unify gaps
  gap?: BoxProps['mx'];
};

const DetailedInfoTimestamp = ({ timestamp, isLoading, noIcon, gap }: Props) => {
  return (
    <>
      { !noIcon && <IconSvg name="clock" boxSize={ 5 } color="gray.500" isLoading={ isLoading } mr={ 2 }/> }
      <Skeleton loading={ isLoading }>
        { dayjs(timestamp).fromNow() }
      </Skeleton>
      <TextSeparator mx={ gap ?? 3 }/>
      <TruncatedValue
        value={ dayjs(timestamp).format('llll') }
        isLoading={ isLoading }
      />
    </>
  );
};

export default DetailedInfoTimestamp;
