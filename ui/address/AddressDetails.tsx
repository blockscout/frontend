import { Box, Flex, Text, Icon, Button, Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address as TAddress, AddressCounters } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import metamaskIcon from 'icons/metamask.svg';
import qrCodeIcon from 'icons/qr_code.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import useFetch from 'lib/hooks/useFetch';
import AddressIcon from 'ui/shared/address/AddressIcon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  addressQuery: UseQueryResult<TAddress>;
}

const AddressDetails = ({ addressQuery }: Props) => {
  const router = useRouter();
  const fetch = useFetch();

  const countersQuery = useQuery<unknown, unknown, AddressCounters>(
    [ QueryKeys.addressCounters, router.query.id ],
    async() => await fetch(`/node-api/addresses/${ router.query.id }/counters`),
    {
      enabled: Boolean(router.query.id) && Boolean(addressQuery.data),
    },
  );

  if (countersQuery.isLoading || addressQuery.isLoading) {
    return <Box>loading</Box>;
  }

  if (countersQuery.isError || addressQuery.isError) {
    return <Box>error</Box>;
  }

  return (
    <Box>
      <Flex alignItems="center">
        <AddressIcon hash={ addressQuery.data.hash }/>
        <Text ml={ 2 } fontFamily="heading" fontWeight={ 500 }>{ addressQuery.data.hash }</Text>
        <CopyToClipboard text={ addressQuery.data.hash }/>
        <Icon as={ metamaskIcon } boxSize={ 6 } ml={ 2 }/>
        <Button variant="outline" size="sm" ml={ 3 }>
          <Icon as={ starOutlineIcon } boxSize={ 5 }/>
        </Button>
        <Button variant="outline" size="sm" ml={ 2 }>
          <Icon as={ qrCodeIcon } boxSize={ 5 }/>
        </Button>
      </Flex>
      <Grid
        mt={ 8 }
        columnGap={ 8 }
        rowGap={{ base: 3, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
      >
        <DetailsInfoItem
          title="Transactions"
          hint="Number of transactions related to this address."
        >
          { Number(countersQuery.data.transaction_count).toLocaleString() }
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Transfers"
          hint="Number of transfers to/from this address."
        >
          { Number(countersQuery.data.token_transfer_count).toLocaleString() }
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Gas used"
          hint="Gas used by the address."
        >
          { BigNumber(countersQuery.data.gas_usage_count).toFormat() }
        </DetailsInfoItem>
        { countersQuery.data.validation_count && (
          <DetailsInfoItem
            title="Blocks validated"
            hint="Number of blocks validated by this validator."
          >
            { Number(countersQuery.data.validation_count).toLocaleString() }
          </DetailsInfoItem>
        ) }
      </Grid>
    </Box>
  );
};

export default React.memo(AddressDetails);
