import type { ThemeTypings } from '@chakra-ui/react';
import { Flex, chakra, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

type Mode = 'compact' | 'long';

interface Props {
  from: AddressParam;
  to: AddressParam;
  current?: string;
  mode?: Mode | Partial<Record<ThemeTypings['breakpoints'], Mode>>;
  className?: string;
  isLoading?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading }: Props) => {
  const iconColor = useColorModeValue('gray.500', 'gray.300');
  const mode = useBreakpointValue({
    base: (typeof modeProp === 'object' ? modeProp.base : modeProp),
    lg: (typeof modeProp === 'object' ? modeProp.lg : modeProp),
    xl: (typeof modeProp === 'object' ? modeProp.xl : modeProp),
  }) ?? 'long';

  if (mode === 'compact') {
    return (
      <Flex className={ className } flexDir="column" rowGap="14px">
        <Flex alignItems="center" columnGap={ 2 }>
          <IconSvg
            name="arrows/east"
            color={ iconColor }
            boxSize={ 5 }
            flexShrink={ 0 }
            transform="rotate(90deg)"
          />
          <AddressEntity
            address={ from }
            isLoading={ isLoading }
            noLink={ current === from.hash }
            noCopy={ current === from.hash }
            maxW="calc(100% - 28px)"
          />
        </Flex>
        <AddressEntity
          address={ to }
          isLoading={ isLoading }
          noLink={ current === to.hash }
          noCopy={ current === to.hash }
          maxW="calc(100% - 28px)"
          ml="28px"
        />
      </Flex>
    );
  }

  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 }>
      <AddressEntity
        address={ from }
        isLoading={ isLoading }
        noLink={ current === from.hash }
        noCopy={ current === from.hash }
        maxW="calc(50% - 18px)"
      />
      <IconSvg name="arrows/east" color={ iconColor } boxSize={ 5 } flexShrink={ 0 }/>
      <AddressEntity
        address={ to }
        isLoading={ isLoading }
        noLink={ current === to.hash }
        noCopy={ current === to.hash }
        maxW="calc(50% - 18px)"
      />
    </Flex>
  );
};

export default chakra(AddressFromTo);
