import type { ThemeTypings } from '@chakra-ui/react';
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
  mode?: Mode | Partial<Record<ThemeTypings['breakpoints'], Mode>>;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({ from, to, current, mode: modeProp, className, isLoading, tokenHash = '', noIcon }: Props) => {
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
            truncation="constant"
            maxW="calc(100% - 28px)"
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
            truncation="constant"
            maxW="calc(100% - 28px)"
            w="min-content"
            ml="28px"
          />
        ) }
      </Flex>
    );
  }

  const isOutgoing = current === from.hash;
  const iconSize = 20;

  return (
    <Grid className={ className } alignItems="center" gridTemplateColumns={ `fit-content(100%) ${ iconSize }px fit-content(100%)` }>
      <Entity
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
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
          noLink={ current === to.hash }
          noCopy={ current === to.hash }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          truncation="constant"
          ml={ 3 }
        />
      ) }
    </Grid>
  );
};

export default chakra(AddressFromTo);
