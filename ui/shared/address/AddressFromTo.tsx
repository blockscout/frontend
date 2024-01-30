import type { ThemeTypings } from '@chakra-ui/react';
import { Flex, chakra, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import AddressFromToIcon from './AddressFromToIcon';
import { getTxCourseType } from './utils';

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
          <AddressFromToIcon
            isLoading={ isLoading }
            type={ getTxCourseType(from.hash, to?.hash, current) }
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
        { to && (
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
        ) }
      </Flex>
    );
  }

  const isOutgoing = current === from.hash;
  const iconSizeWithMargins = (5 + (isOutgoing ? 4 : 2) + 3) * 4;

  return (
    <Flex className={ className } alignItems="center">
      <Entity
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        truncation={ truncation }
        maxW={ truncation === 'constant' ? undefined : `calc(50% - ${ iconSizeWithMargins / 2 }px)` }
        mr={ isOutgoing ? 4 : 2 }
      />
      <AddressFromToIcon
        isLoading={ isLoading }
        type={ getTxCourseType(from.hash, to?.hash, current) }
      />
      { to && (
        <Entity
          address={ to }
          isLoading={ isLoading }
          noLink={ current === to.hash }
          noCopy={ current === to.hash }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          truncation={ truncation }
          maxW={ truncation === 'constant' ? undefined : `calc(50% - ${ iconSizeWithMargins / 2 }px)` }
          ml={ 3 }
        />
      ) }
    </Flex>
  );
};

export default chakra(AddressFromTo);
