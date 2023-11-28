import { Flex, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import arrowDown from 'icons/arrows/arrow-down.svg';
import arrowUp from 'icons/arrows/arrow-up.svg';

interface SortingListProps<K extends string, T extends string> {
  items: Array<{ key: K; title: string }>;
  value: T;
  onChange: (newValue: T) => void;
  instantSelect?: boolean;
}

const SortingList = <K extends string, T extends string>({ items, value, onChange, instantSelect }: SortingListProps<K, T>) => {
  const iconColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');
  const clickHandlers = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.key] = instantSelect ? (
        () => {
          onChange(`${ item.key }` as T);
        }
      ) : (
        () => {
          if (value === `${ item.key }-desc`) {
            onChange(`${ item.key }-asc` as T);
          } else {
            onChange(`${ item.key }-desc` as T);
          }
        }
      );
      return acc;
    }, {} as Record<K, () => void>);
  }, [ items, value, onChange, instantSelect ]);
  return (
    <VStack align="stretch" gap={ 0 } mt={ -2 } mb={ -2 }>
      { items.map((item) => {
        return (
          <Flex paddingY={ 2 } key={ item.key } flexDir="row" cursor="pointer" onClick={ clickHandlers[item.key] }>
            <Flex grow={ 1 }>{ item.title }</Flex>
            { !instantSelect ? (
              <Flex align="center" justify="center">
                { value === `${ item.key }-desc` && <Icon as={ arrowDown } color={ iconColor }/> }
                { value === `${ item.key }-asc` && <Icon as={ arrowUp } color={ iconColor }/> }
              </Flex>
            ) : null }
          </Flex>
        );
      }) }
    </VStack>
  );
};

export default SortingList;
