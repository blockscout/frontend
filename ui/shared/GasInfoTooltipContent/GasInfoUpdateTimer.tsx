import { CircularProgress } from '@chakra-ui/react';
import React from 'react';

import dayjs from 'lib/date/dayjs';

interface Props {
  startTime: number;
  duration: number;
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

const GasInfoUpdateTimer = ({ startTime, duration }: Props) => {
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

  return <CircularProgress value={ value } trackColor="whiteAlpha.100" size={ 4 }/>;
};

export default React.memo(GasInfoUpdateTimer);
