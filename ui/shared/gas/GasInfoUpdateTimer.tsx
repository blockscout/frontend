import { CircularProgress, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';

interface Props {
  startTime: number;
  duration: number;
  className?: string;
  size?: number;
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

const GasInfoUpdateTimer = ({ startTime, duration, className, size = 4 }: Props) => {
  const [ value, setValue ] = React.useState(getValue(dayjs(startTime), duration));
  const trackColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');

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

  return <CircularProgress className={ className } value={ value } trackColor={ trackColor } size={ size }/>;
};

export default React.memo(chakra(GasInfoUpdateTimer));
