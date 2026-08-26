// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import type { BatchRecipients } from 'src/features/chain-variants/eden/utils/batch-recipients';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Badge } from 'src/toolkit/chakra/badge';
import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  data: schemas['TransactionResponse'];
  isLoading?: boolean;
  recipients: BatchRecipients;
  onViewDetailClick: () => void;
}

const TxDetailsTo = ({ data, isLoading, recipients, onViewDetailClick }: Props) => {
  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...toAddress?.private_tags || [],
    ...toAddress?.public_tags || [],
    ...toAddress?.watchlist_names || [],
  ].map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>);

  const executionSuccessBadge = toAddress?.is_contract && data.result === 'success' ? (
    <Tooltip content="Contract execution completed">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <SpriteIcon name="status/success" boxSize={ 4 } color={{ _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' }} cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip content="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <SpriteIcon name="status/error" boxSize={ 4 } color="text.error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const toFieldContent = toAddress ? (
    <>
      { data.to && data.to.hash ? (
        <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
          <AddressEntity
            address={ toAddress }
            isLoading={ isLoading }
          />
          { executionSuccessBadge }
          { executionFailedBadge }
        </Flex>
      ) : (
        <Flex width="100%" whiteSpace="pre" alignItems="center" flexShrink={ 0 }>
          <span>[Contract </span>
          <AddressEntity
            address={ toAddress }
            isLoading={ isLoading }
            noIcon
          />
          <span>created]</span>
          { executionSuccessBadge }
          { executionFailedBadge }
        </Flex>
      ) }
      { addressToTags.length > 0 && (
        <Flex columnGap={ 3 }>
          { addressToTags }
        </Flex>
      ) }
    </>
  ) : (
    <span>[ Contract creation ]</span>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Address (external or contract) receiving the transaction"
        isLoading={ isLoading }
      >
        { data.to?.is_contract ? 'Interacted with contract' : 'To' }
      </DetailedInfo.ItemLabel>
      { recipients.hasMultipleRecipients ? (
        <DetailedInfo.ItemValue flexDir="column" alignItems="flex-start" rowGap={ 1 }>
          { recipients.visibleRecipients.map((call, index) => (
            <Flex
              key={ index }
              flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              alignItems="center"
              columnGap={ 3 }
              maxW="100%"
              minH={ DetailedInfo.ITEM_VALUE_LINE_HEIGHT }
            >
              { call.to === data.to?.hash ?
                toFieldContent :
                <AddressEntity address={{ hash: call.to }} isLoading={ isLoading }/> }
            </Flex>
          )) }
          { recipients.hasOverflow && (
            <Link variant="secondary" textStyle="sm" onClick={ onViewDetailClick } mt={ 1.5 }>
              { `View all (${ recipients.count })` }
            </Link>
          ) }
        </DetailedInfo.ItemValue>
      ) : (
        <DetailedInfo.ItemValue
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          columnGap={ 3 }
        >
          { toFieldContent }
        </DetailedInfo.ItemValue>
      ) }
    </>
  );
};

export default React.memo(TxDetailsTo);
