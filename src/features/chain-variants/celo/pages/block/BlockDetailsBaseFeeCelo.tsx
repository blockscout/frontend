// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { BlockBaseFeeCelo } from 'src/features/chain-variants/celo/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import TokenValue from 'src/shared/values/entity/TokenValue';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

type ItemProps = BlockBaseFeeCelo['breakdown'][number] & {
  addressFrom: schemas['Address'];
  token: schemas['Token'];
};

const BreakDownItem = ({ amount, percentage, address, addressFrom, token }: ItemProps) => {
  const isBurning = address.hash === ZERO_ADDRESS;

  return (
    <Flex alignItems="center" columnGap={ 2 } flexWrap="wrap">
      <Box color="text.secondary">{ percentage }% of amount</Box>
      <TokenValue
        amount={ amount }
        token={ token }
      />
      { isBurning ? (
        <>
          <AddressEntity address={ addressFrom } truncation="constant"/>
          <SpriteIcon name="flame" boxSize={ 5 } color="icon.primary"/>
          <Box color="text.secondary">burnt</Box>
        </>
      ) : <AddressFromTo from={ addressFrom } to={ address }/> }
    </Flex>
  );
};

interface Props {
  data: BlockBaseFeeCelo;
}

const BlockDetailsBaseFeeCelo = ({ data }: Props) => {
  const totalFeeLabel = (
    <Box whiteSpace="pre-wrap">
      <span>The FeeHandler regularly burns 80% of its tokens. Non-CELO tokens are swapped to CELO beforehand. The remaining 20% are sent to the </span>
      <Link external href="https://www.ultragreen.money">Green Fund</Link>
      <span>.</span>
    </Box>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The contract receiving the base fee, responsible for handling fee usage. This contract is controlled by governance process."
      >
        Base fee handler
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={ data.recipient }/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel hint={ totalFeeLabel }>
        Base fee total
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow flexDirection="column" alignItems="flex-start">
        <TokenValue
          amount={ data.amount }
          token={ data.token }
        />
        { data.breakdown.length > 0 && (
          <Flex flexDir="column" rowGap={ 2 } mt={ 2 }>
            { data.breakdown.map((item, index) => (
              <BreakDownItem
                key={ index }
                { ...item }
                addressFrom={ data.recipient }
                token={ data.token }
              />
            )) }
          </Flex>
        ) }
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBaseFeeCelo);
