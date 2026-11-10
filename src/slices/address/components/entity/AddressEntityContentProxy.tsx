// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ContentBaseProps } from 'src/shared/entities/components';
import * as EntityBase from 'src/shared/entities/components';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

import type { AddressProp } from './AddressEntity';
import AddressEntity from './AddressEntity';

interface Props extends Omit<ContentBaseProps, 'text'> {
  address: AddressProp;
  altHash: string | undefined;
}

const MAX_IMPLEMENTATION_COLUMNS = 3;
const TOOLTIP_MAX_WIDTH = { base: 'calc(100vw - 8px)', lg: '410px' };

const AddressEntityContentProxy = ({ address, altHash, tooltipContentAfter, tooltipInteractive, ...props }: Props) => {
  const implementations = address.implementations;

  if (!implementations || implementations.length === 0) {
    return null;
  }

  const colNum = Math.min(implementations.length, MAX_IMPLEMENTATION_COLUMNS);
  const nameTag = address.metadata?.tags.find(tag => tag.tagType === 'name')?.name;

  const implementationName = implementations.length === 1 && implementations[0].name ? implementations[0].name : undefined;
  const displayedName = nameTag || implementationName || address.name;

  const content = (
    <>
      <Box fontWeight={ 600 }>
        Proxy contract
        { address.name ? ` (${ address.name })` : '' }
      </Box>
      <AddressEntity
        address={{ hash: address.hash, filecoin: address.filecoin }}
        noLink
        noIcon
        noHighlight
        noTooltip
        justifyContent="center"
        w="100%"
      />
      <Box fontWeight={ 600 } mt={ 2 }>
        Implementation{ implementations.length > 1 ? 's' : '' }
        { implementationName ? ` (${ implementationName })` : '' }
      </Box>
      <Flex flexWrap="wrap" columnGap={ 3 }>
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{ hash: item.address_hash, filecoin: { robust: item.filecoin_robust_address ?? null, actor_type: null, id: null } }}
            noLink
            noIcon
            noHighlight
            noTooltip
            minW={ `calc((100% - ${ colNum - 1 } * 12px) / ${ colNum })` }
            flex={ 1 }
            justifyContent={ colNum === 1 ? 'center' : undefined }
          />
        )) }
      </Flex>
      { tooltipContentAfter }
    </>
  );

  return (
    <Tooltip content={ content } interactive contentProps={{ maxW: TOOLTIP_MAX_WIDTH }}>
      <Box display="inline-flex" w="100%" minW={ 0 }>
        <EntityBase.Content
          { ...props }
          truncation={ displayedName ? 'tail' : props.truncation }
          text={ displayedName || altHash || address.hash }
          noTooltip
        />
      </Box>
    </Tooltip>
  );
};

export default React.memo(AddressEntityContentProxy);
