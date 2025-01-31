import { Box, Flex, Link } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';
import type { BlockBaseFeeCelo } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import { WEI, ZERO_ADDRESS } from 'lib/consts';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

type ItemProps = BlockBaseFeeCelo['breakdown'][number] & {
  addressFrom: AddressParam;
  token: TokenInfo;
};

const BreakDownItem = ({ amount, percentage, address, addressFrom, token }: ItemProps) => {
  const isBurning = address.hash === ZERO_ADDRESS;

  return (
    <Flex alignItems="center" columnGap={ 2 } rowGap={ 1 } flexWrap="wrap">
      <Box color="text_secondary">{ percentage }% of amount</Box>
      <Flex columnGap={ 2 }>
        { BigNumber(amount).dividedBy(WEI).toFixed() }
        <TokenEntity token={ token } noCopy onlySymbol/>
      </Flex>
      { isBurning ? (
        <>
          <AddressEntity address={ addressFrom } truncation="constant"/>
          <IconSvg name="flame" boxSize={ 5 } color="gray.500"/>
          <Box color="text_secondary">burnt</Box>
        </>
      ) : <AddressFromTo from={ addressFrom } to={ address }/> }
    </Flex>
  );
};

interface Props {
  data: BlockBaseFeeCelo;
}

const BlockDetailsBaseFeeCelo = ({ data }: Props) => {
  const totalBaseFee = BigNumber(data.amount).dividedBy(WEI).toFixed();

  const totalFeeLabel = (
    <Box whiteSpace="pre-wrap">
      <span>The FeeHandler regularly burns 80% of its tokens. Non-CELO tokens are swapped to CELO beforehand. The remaining 20% are sent to the </span>
      <Link isExternal href="https://www.ultragreen.money">Green Fund</Link>
      <span>.</span>
    </Box>
  );

  return (
    <>
      <DetailsInfoItem.Label
        hint="The contract receiving the base fee, responsible for handling fee usage. This contract is controlled by governance process."
      >
        Base fee handler
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity address={ data.recipient }/>
      </DetailsInfoItem.Value>
      <DetailsInfoItem.Label
        hint={ totalFeeLabel }
        type="popover"
      >
        Base fee total
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value display="block">
        <Flex columnGap={ 2 }>
          { totalBaseFee }
          <TokenEntity token={ data.token } noCopy onlySymbol/>
        </Flex>
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
      </DetailsInfoItem.Value>
      <DetailsInfoItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBaseFeeCelo);
