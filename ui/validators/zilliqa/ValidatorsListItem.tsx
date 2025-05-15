import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props {
  data: ValidatorsZilliqaItem;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>BLS public key</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ValidatorEntity
          isLoading={ isLoading }
          id={ data.bls_public_key }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { data.index }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Balance</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { BigNumber(data.balance).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() } { config.chain.currency.symbol }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
