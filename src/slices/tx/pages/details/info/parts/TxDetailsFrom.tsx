// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Badge } from 'src/toolkit/chakra/badge';

interface Props {
  from: schemas['TransactionResponse']['from'];
  isLoading: boolean;
}

const TxDetailsFrom = ({ from, isLoading }: Props) => {
  const tags = [
    ...from.private_tags || [],
    ...from.public_tags || [],
    ...from.watchlist_names || [],
  ];

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Address (external or contract) sending the transaction"
        isLoading={ isLoading }
      >
        From
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 3 }>
        <AddressEntity
          address={ from }
          isLoading={ isLoading }
        />
        { from.name && <Text>{ from.name }</Text> }
        { tags.length > 0 && (
          <Flex columnGap={ 3 }>
            { tags.map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>) }
          </Flex>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsFrom);
