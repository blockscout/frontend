import { Box, chakra, Flex, Grid } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import useApiQuery from 'lib/api/useApiQuery';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';

const DomainsGrid = ({ data }: { data: Array<multichain.Domain> }) => {
  return (
    <Grid
      templateColumns={{ base: `repeat(${ clamp(data.length, 1, 2) }, 1fr)`, lg: `repeat(${ clamp(data.length, 1, 3) }, 1fr)` }}
      columnGap={ 8 }
      rowGap={ 4 }
      mt={ 2 }
    >
      { data.map((domain) => <EnsEntity key={ domain.name } domain={ domain.name } protocol={ domain.protocol } noCopy noLink/>) }
    </Grid>
  );
};

interface Props {
  isLoading: boolean;
  mainDomain: multichain.BasicDomainInfo | undefined;
  hash: string;
}

const OpSuperchainAddressEnsDomains = ({ mainDomain, isLoading: isLoadingProps, hash }: Props) => {
  const popover = useDisclosure();

  const { data, isPending } = useApiQuery('multichainAggregator:address_domains', {
    pathParams: { hash },
  });

  const isLoading = isLoadingProps || isPending;

  if (!isLoading && (!data || data.items.length === 0)) {
    return null;
  }

  const totalRecords = data?.items.length ?? 0;
  const totalRecordsPostfix = data?.next_page_params ? '+' : '';
  const ownedDomains = (data?.items ?? []).filter((domain) => domain.name !== mainDomain?.name);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content="List of names resolved or owned by this address" disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label="Address domains"
              fontWeight={ 500 }
              flexShrink={ 0 }
              columnGap={ 1 }
              loadingSkeleton={ isLoading }
            >
              <IconSvg name="ENS" boxSize={ 5 }/>
              <chakra.span hideBelow="xl">{ totalRecords }{ totalRecordsPostfix } Domain{ totalRecords > 1 ? 's' : '' }</chakra.span>
              <chakra.span hideFrom="xl">{ totalRecords }{ totalRecordsPostfix }</chakra.span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent w={{ lg: '500px' }} maxH="400px" overflowY="auto">
        <PopoverBody textStyle="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          { mainDomain && (
            <Box w="100%">
              <chakra.span color="text.secondary" textStyle="xs">Primary*</chakra.span>
              <Flex alignItems="center" textStyle="md" mt={ 2 }>
                <EnsEntity
                  domain={ mainDomain.name }
                  protocol={ mainDomain.protocol }
                  fontWeight={ 600 }
                  noCopy
                  noLink
                />
              </Flex>
            </Box>
          ) }
          { ownedDomains.length > 0 && (
            <div>
              <chakra.span color="text.secondary" textStyle="xs">Owned by this address</chakra.span>
              <DomainsGrid data={ ownedDomains }/>
            </div>
          ) }
          { mainDomain && (
            <chakra.span textStyle="xs" mt={ -1 }>
              *A domain name is not necessarily held by a person popularly associated with the name
            </chakra.span>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(OpSuperchainAddressEnsDomains);
