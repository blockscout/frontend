import type { ProgressCircle } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';
import { ProgressCircleRing, ProgressCircleRoot } from 'toolkit/chakra/progress-circle';

interface Props {
  startTime: number;
  duration: number;
  className?: string;
  size?: ProgressCircle.RootProps['size'];
}

const getValue = (startDate: dayjs.Dayjs, duration: number) => {
  const now = dayjs();
  const diff = now.diff(startDate, 'ms');
  const value = diff / duration * 100;

  if (value >= 99) {
    return 99;
  }

  return value;
};

const GasInfoUpdateTimer = ({ startTime, duration, className, size = 'sm' }: Props) => {
  const [ value, setValue ] = React.useState(getValue(dayjs(startTime), duration));

  React.useEffect(() => {
    const startDate = dayjs(startTime);

    const intervalId = window.setInterval(() => {
      const nextValue = getValue(startDate, duration);
      setValue(nextValue);
      if (nextValue === 99) {
        window.clearInterval(intervalId);
      }
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ startTime, duration ]);

  return (
    <ProgressCircleRoot
      className={ className }
      value={ value }
      size={ size }
    >
      <ProgressCircleRing/>
    </ProgressCircleRoot>
  );
};

export default React.memo(chakra(GasInfoUpdateTimer));
