import { Flex, Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorZilliqa } from 'types/api/validators';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';

interface Props {
  data: ValidatorZilliqa;
  isLoading: boolean;
}

const ValidatorDetails = ({ data, isLoading }: Props) => {
  return (
    <Grid columnGap={ 8 } rowGap={ 3 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
      <DetailsInfoItem.Label
        hint="Index of the staker in the committee"
        isLoading={ isLoading }
      >
        Index
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading } display="inline">
          { data.index }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Staker's balance"
        isLoading={ isLoading }
      >
        Staked
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <NativeTokenIcon isLoading={ isLoading } boxSize={ 5 } mr={ 2 }/>
        <Skeleton isLoaded={ !isLoading } display="inline">
          { BigNumber(data.balance).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() } { config.chain.currency.symbol }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="libp2p peer ID, corresponding to the staker's BLS public key"
        isLoading={ isLoading }
      >
        Peer ID
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Flex alignItems="center" w="100%" minWidth={ 0 }>
          <Skeleton isLoaded={ !isLoading } maxW="calc(100% - 28px)" overflow="hidden">
            <HashStringShortenDynamic hash={ data.peer_id }/>
          </Skeleton>
          <CopyToClipboard text={ data.peer_id } isLoading={ isLoading }/>
        </Flex>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The address used for authenticating requests from this staker to the deposit contract"
        isLoading={ isLoading }
      >
        Control address
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity address={ data.control_address } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The address which rewards for this staker will be sent to"
        isLoading={ isLoading }
      >
        Reward address
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity address={ data.reward_address } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The address whose key the validator uses to sign cross-chain events"
        isLoading={ isLoading }
      >
        Signing address
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity address={ data.signing_address } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Block number at which the staker was added"
        isLoading={ isLoading }
      >
        Added at block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <BlockEntity number={ data.added_at_block_number } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Block number at which the staker's stake was last updated"
        isLoading={ isLoading }
      >
        Stake updated
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <BlockEntity number={ data.stake_updated_at_block_number } isLoading={ isLoading }/>
      </DetailsInfoItem.Value>

      <DetailsSponsoredItem isLoading={ isLoading }/>
    </Grid>
  );
};

export default React.memo(ValidatorDetails);
