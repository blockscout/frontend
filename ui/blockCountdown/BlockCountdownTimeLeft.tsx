import { HStack, StackDivider, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'lib/consts';

import BlockCountdownTimeLeftItem from './BlockCountdownTimeLeftItem';
import splitSecondsInPeriods from './splitSecondsInPeriods';

interface Props {
  value: number;
}

const BlockCountdownTimeLeft = ({ value: initialValue }: Props) => {

  const [ value, setValue ] = React.useState(initialValue);

  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        return 0;
      });
    }, SECOND);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ initialValue ]);

  const periods = splitSecondsInPeriods(value);

  return (
    <HStack
      bgColor={ bgColor }
      mt={ 2 }
      p={ 4 }
      borderRadius="base"
      divider={ <StackDivider borderColor="divider"/> }
    >
      <BlockCountdownTimeLeftItem label="Days" value={ periods.days }/>
      <BlockCountdownTimeLeftItem label="Hours" value={ periods.hours }/>
      <BlockCountdownTimeLeftItem label="Minutes" value={ periods.minutes }/>
      <BlockCountdownTimeLeftItem label="Seconds" value={ periods.seconds }/>
    </HStack>
  );
};

export default React.memo(BlockCountdownTimeLeft);
