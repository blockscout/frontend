import type { ConditionalValue } from '@chakra-ui/react';
import { Flex, Grid, chakra, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'types/client/chainInfo';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import AddressEntityWithExternalChain from '../entities/address/AddressEntityWithExternalChain';
import AddressFromToIcon from './AddressFromToIcon';
import { getTxCourseType } from './utils';

type Mode = 'compact' | 'long';

interface Props {
  from: { hash: string };
  chainFrom?: ChainInfo | null;
  to: { hash: string } | null;
  chainTo?: ChainInfo | null;
  current?: string;
  mode?: Mode | ConditionalValue<Mode>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  tokenSymbol?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({
  from,
  chainFrom,
  to,
  chainTo,
  current,
  mode: modeProp,
  className, isLoading, tokenHash = '', tokenSymbol = '', noIcon }: Props) => {
  const mode = useBreakpointValue(
    {
      base: (typeof modeProp === 'object' && 'base' in modeProp ? modeProp.base : modeProp),
      lg: (typeof modeProp === 'object' && 'lg' in modeProp ? modeProp.lg : modeProp),
      xl: (typeof modeProp === 'object' && 'xl' in modeProp ? modeProp.xl : modeProp),
    },
  ) ?? 'long';

  const EntityFrom = (() => {
    if (chainFrom !== undefined) {
      return AddressEntityWithExternalChain;
    }
    if (tokenHash && tokenSymbol) {
      return AddressEntityWithTokenFilter;
    }
    return AddressEntity;
  })();

  const EntityTo = (() => {
    if (chainTo !== undefined) {
      return AddressEntityWithExternalChain;
    }
    if (tokenHash && tokenSymbol) {
      return AddressEntityWithTokenFilter;
    }
    return AddressEntity;
  })();

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
          <EntityFrom
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
            externalChain={ chainFrom }
          />
        </Flex>
        { to && (
          <EntityTo
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
            externalChain={ chainTo }
          />
        ) }
      </Flex>
    );
  }

  const iconSize = 20;

  return (
    <Grid className={ className } alignItems="center" gridTemplateColumns={ `minmax(auto, min-content) ${ iconSize }px minmax(auto, min-content)` }>
      <EntityFrom
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        tokenSymbol={ tokenSymbol }
        truncation="constant"
        mr={ isOutgoing ? 4 : 2 }
        externalChain={ chainFrom }
      />
      <AddressFromToIcon
        isLoading={ isLoading }
        type={ getTxCourseType(from.hash, to?.hash, current) }
      />
      { to && (
        <EntityTo
          address={ to }
          isLoading={ isLoading }
          noLink={ isIncoming }
          noCopy={ isIncoming }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          tokenSymbol={ tokenSymbol }
          truncation="constant"
          ml={ 3 }
          externalChain={ chainTo }
        />
      ) }
    </Grid>
  );
};

export default chakra(AddressFromTo);
