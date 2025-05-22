import type { ConditionalValue } from '@chakra-ui/react';
import { Flex, Grid, chakra, useBreakpointValue } from '@chakra-ui/react';
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
  mode?: Mode | ConditionalValue<Mode>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  tokenSymbol?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading, tokenHash = '', tokenSymbol = '', noIcon }: Props) => {
  const mode = useBreakpointValue(
    {
      base: (typeof modeProp === 'object' && 'base' in modeProp ? modeProp.base : modeProp),
      lg: (typeof modeProp === 'object' && 'lg' in modeProp ? modeProp.lg : modeProp),
      xl: (typeof modeProp === 'object' && 'xl' in modeProp ? modeProp.xl : modeProp),
    },
  ) ?? 'long';

  const Entity = tokenHash && tokenSymbol ? AddressEntityWithTokenFilter : AddressEntity;
  const isOutgoing = current ? current.toLowerCase() === from.hash.toLowerCase() : false;
  const isIncoming = current ? current.toLowerCase() === to?.hash?.toLowerCase() : false;

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
            noLink={ isOutgoing }
            noCopy={ isOutgoing }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            tokenSymbol={ tokenSymbol }
            truncation="constant"
            maxW="calc(100% - 28px)"
            w="min-content"
          />
        </Flex>
        { to && (
          <Entity
            address={ to }
            isLoading={ isLoading }
            noLink={ isIncoming }
            noCopy={ isIncoming }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            tokenSymbol={ tokenSymbol }
            truncation="constant"
            maxW="calc(100% - 28px)"
            w="min-content"
            ml="28px"
          />
        ) }
      </Flex>
    );
  }

  const iconSize = 20;

  return (
    <Grid className={ className } alignItems="center" gridTemplateColumns={ `minmax(auto, min-content) ${ iconSize }px minmax(auto, min-content)` }>
      <Entity
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        tokenSymbol={ tokenSymbol }
        truncation="constant"
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
          noLink={ isIncoming }
          noCopy={ isIncoming }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          tokenSymbol={ tokenSymbol }
          truncation="constant"
          ml={ 3 }
        />
      ) }
    </Grid>
  );
};

export default chakra(AddressFromTo);
