import {
  Box,
  Button,
  Flex,
  Grid,
  Hide,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Show,
  Skeleton,
  useDisclosure,
  chakra,
} from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import _clamp from 'lodash/clamp';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import Popover from 'ui/shared/chakra/Popover';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PopoverTriggerTooltip from 'ui/shared/PopoverTriggerTooltip';

interface Props {
  query: UseQueryResult<bens.LookupAddressResponse, ResourceError<unknown>>;
  addressHash: string;
  mainDomainName: string | null | undefined;
}

const DomainsGrid = ({ data }: { data: Array<bens.Domain> }) => {
  return (
    <Grid
      templateColumns={{ base: `repeat(${ _clamp(data.length, 1, 2) }, 1fr)`, lg: `repeat(${ _clamp(data.length, 1, 3) }, 1fr)` }}
      columnGap={ 8 }
      rowGap={ 4 }
      mt={ 2 }
    >
      { data.slice(0, 9).map((domain) => <EnsEntity key={ domain.id } domain={ domain.name } protocol={ domain.protocol } noCopy/>) }
    </Grid>
  );
};

const AddressEnsDomains = ({ query, addressHash, mainDomainName }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { data, isPending, isError } = query;

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton h={ 8 } w={{ base: '50px', xl: '120px' }} borderRadius="base"/>;
  }

  if (data.items.length === 0) {
    return null;
  }

  const mainDomain = data.items.find((domain) => mainDomainName && domain.name === mainDomainName);
  const ownedDomains = data.items.filter((domain) => {
    if (mainDomainName && domain.name === mainDomainName) {
      return false;
    }

    // exclude resolved address
    if (domain.resolved_address && domain.resolved_address.hash.toLowerCase() === addressHash.toLowerCase()) {
      return false;
    }

    if (domain.owner && domain.owner.hash.toLowerCase() === addressHash.toLowerCase()) {
      return true;
    }

    // include wrapped owner
    if (domain.wrapped_owner?.hash.toLowerCase() === addressHash.toLowerCase()) {
      return !domain.resolved_address || domain.resolved_address.hash.toLowerCase() !== addressHash.toLowerCase();
    }

    return false;
  });
  const resolvedDomains = data.items.filter((domain) =>
    domain.resolved_address &&
    domain.resolved_address.hash.toLowerCase() === addressHash.toLowerCase() &&
    domain.name !== mainDomainName,
  );

  const totalRecords = data.items.length > 40 ? '40+' : data.items.length;

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <PopoverTriggerTooltip label="List of names resolved or owned by this address">
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={ onToggle }
            isActive={ isOpen }
            aria-label="Address domains"
            fontWeight={ 500 }
            px={ 2 }
            h="32px"
            flexShrink={ 0 }
          >
            <IconSvg name="ENS_slim" boxSize={ 5 }/>
            <Show above="xl">
              <chakra.span ml={ 1 }>{ totalRecords } Domain{ data.items.length > 1 ? 's' : '' }</chakra.span>
            </Show>
            <Hide above="xl">
              <chakra.span ml={ 1 }>{ totalRecords }</chakra.span>
            </Hide>
          </Button>
        </PopoverTriggerTooltip>
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '500px' }}>
        <PopoverBody px={ 6 } py={ 5 } fontSize="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          { mainDomain && (
            <Box w="100%">
              <chakra.span color="text_secondary" fontSize="xs">Primary*</chakra.span>
              <Flex alignItems="center" fontSize="md" mt={ 2 }>
                <EnsEntity domain={ mainDomain.name } protocol={ mainDomain.protocol } fontWeight={ 600 } noCopy/>
                { mainDomain.expiry_date &&
                    <chakra.span color="text_secondary" whiteSpace="pre"> (expires { dayjs(mainDomain.expiry_date).fromNow() })</chakra.span> }
              </Flex>
            </Box>
          ) }
          { ownedDomains.length > 0 && (
            <div>
              <chakra.span color="text_secondary" fontSize="xs">Owned by this address</chakra.span>
              <DomainsGrid data={ ownedDomains }/>
            </div>
          ) }
          { resolvedDomains.length > 0 && (
            <div>
              <chakra.span color="text_secondary" fontSize="xs">Resolved to this address</chakra.span>
              <DomainsGrid data={ resolvedDomains }/>
            </div>
          ) }
          { (ownedDomains.length > 9 || resolvedDomains.length > 9) && (
            <LinkInternal
              href={ route({ pathname: '/name-domains', query: { owned_by: 'true', resolved_to: 'true', address: addressHash } }) }
            >
              <span> More results</span>
              <chakra.span color="text_secondary"> ({ totalRecords })</chakra.span>
            </LinkInternal>
          ) }
          { mainDomain && (
            <chakra.span fontSize="xs" mt={ -1 }>
              *A domain name is not necessarily held by a person popularly associated with the name
            </chakra.span>
          ) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(AddressEnsDomains);
