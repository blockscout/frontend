import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'types/api/validators';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TruncatedValue from 'ui/shared/TruncatedValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: ValidatorBlackfort;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="130px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          isLoading={ isLoading }
          address={ data.address }
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      { data.name && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Name</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Flex><TruncatedValue value={ data.name } isLoading={ isLoading }/></Flex>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Commission</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { `${ data.commission / 100 }%` }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Self bonded</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ data.self_bonded_amount }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Delegated amount</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ data.delegated_amount }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
