// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ListItemMobile from 'src/shared/lists/ListItemMobile';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { getTypeColor } from '../../utils/utils';

interface Props {
  data: schemas['FheOperation'];
  isLoading?: boolean;
}

const TxFHEOperationsListItem = (props: Props) => {
  const { data, isLoading } = props;

  return (
    <ListItemMobile>
      <Flex gap={ 2 } flexWrap="wrap" alignItems="center">
        <Badge colorPalette={ getTypeColor(data.type) } loading={ isLoading }>
          { capitalize(data.type) }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { data.fhe_type }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { data.is_scalar ? 'Scalar' : 'Non-scalar' }
        </Badge>
      </Flex>

      <Grid templateColumns="110px 1fr" rowGap={ 2 } columnGap={ 2 }>
        <Text fontWeight="medium">Index</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { data.log_index }
        </Skeleton>

        <Text fontWeight="medium">Operation</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { data.operation }
        </Skeleton>

        <Text fontWeight="medium">HCU cost</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { data.hcu_cost.toLocaleString() }
        </Skeleton>

        <Text fontWeight="medium">HCU depth</Text>
        <Skeleton loading={ isLoading } color="text.secondary">
          { data.hcu_depth.toLocaleString() }
        </Skeleton>

        <Text fontWeight="medium">Caller</Text>
        <Box minW={ 0 }>
          { data.caller && data.caller.hash ? (
            <AddressEntity
              address={ data.caller }
              truncation="constant"
              isLoading={ isLoading }
            />
          ) : (
            <Text color="text.secondary">—</Text>
          ) }
        </Box>
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(TxFHEOperationsListItem);
