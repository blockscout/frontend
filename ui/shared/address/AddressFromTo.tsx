import type { ThemeTypings } from '@chakra-ui/react';
import { Flex, chakra, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';
import IconSvg from 'ui/shared/IconSvg';

type Mode = 'compact' | 'long';

interface Props {
  from: AddressParam;
  to: AddressParam | null;
  current?: string;
  mode?: Mode | Partial<Record<ThemeTypings['breakpoints'], Mode>>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading, tokenHash = '', truncation, noIcon }: Props) => {
  const iconColor = useColorModeValue('gray.500', 'gray.300');
  const mode = useBreakpointValue(
    {
      base: (typeof modeProp === 'object' ? modeProp.base : modeProp),
      lg: (typeof modeProp === 'object' ? modeProp.lg : modeProp),
      xl: (typeof modeProp === 'object' ? modeProp.xl : modeProp),
    },
  ) ?? 'long';

  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

  if (mode === 'compact') {
    return (
      <Flex className={ className } flexDir="column" rowGap={ 3 }>
        <Flex alignItems="center" columnGap={ 2 }>
          <IconSvg
            name="arrows/east"
            isLoading={ isLoading }
            color={ iconColor }
            boxSize={ 5 }
            flexShrink={ 0 }
            transform="rotate(90deg)"
          />
          <Entity
            address={ from }
            isLoading={ isLoading }
            noLink={ current === from.hash }
            noCopy={ current === from.hash }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            truncation={ truncation }
            maxW={ truncation === 'constant' ? undefined : 'calc(100% - 28px)' }
            w="min-content"
          />
        </Flex>
        { to ? (
          <Entity
            address={ to }
            isLoading={ isLoading }
            noLink={ current === to.hash }
            noCopy={ current === to.hash }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            truncation={ truncation }
            maxW={ truncation === 'constant' ? undefined : 'calc(100% - 28px)' }
            w="min-content"
            ml="28px"
          />
        ) : <span>-</span> }
      </Flex>
    );
  }

  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 }>
      <Entity
        address={ from }
        isLoading={ isLoading }
        noLink={ current === from.hash }
        noCopy={ current === from.hash }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        truncation={ truncation }
        maxW={ truncation === 'constant' ? undefined : 'calc(50% - 18px)' }
      />
      <IconSvg name="arrows/east" color={ iconColor } boxSize={ 5 } flexShrink={ 0 } isLoading={ isLoading }/>
      { to ? (
        <Entity
          address={ to }
          isLoading={ isLoading }
          noLink={ current === to.hash }
          noCopy={ current === to.hash }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          truncation={ truncation }
          maxW={ truncation === 'constant' ? undefined : 'calc(50% - 18px)' }
        />
      ) : <span>-</span> }
    </Flex>
  );
};

export default chakra(AddressFromTo);
