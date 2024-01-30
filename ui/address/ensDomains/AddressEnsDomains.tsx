import { Button, chakra, Flex, Grid, Hide, Popover, PopoverBody, PopoverContent, PopoverTrigger, Show, Skeleton, useDisclosure } from '@chakra-ui/react';
import _clamp from 'lodash/clamp';
import React from 'react';

import type { EnsDomain } from 'types/api/ens';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  addressHash: string;
  mainDomainName: string | null;
}

const DomainsGrid = ({ data }: { data: Array<EnsDomain> }) => {
  return (
    <Grid
      templateColumns={{ base: `repeat(${ _clamp(data.length, 1, 2) }, 1fr)`, lg: `repeat(${ _clamp(data.length, 1, 3) }, 1fr)` }}
      columnGap={ 8 }
      rowGap={ 4 }
      mt={ 2 }
    >
      { data.slice(0, 9).map((domain) => <EnsEntity key={ domain.id } name={ domain.name } noCopy/>) }
    </Grid>
  );
};

const AddressEnsDomains = ({ addressHash, mainDomainName }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { data, isPending, isError } = useApiQuery('addresses_lookup', {
    pathParams: { chainId: config.chain.id },
    queryParams: {
      address: addressHash,
      resolved_to: true,
      owned_by: true,
      only_active: true,
      order: 'ASC',
    },
  });

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton h={ 8 } w={{ base: '50px', xl: '120px' }} borderRadius="base"/>;
  }

  if (data.items.length === 0) {
    return null;
  }

  const mainDomain = data.items.find((domain) => domain.name === mainDomainName);
  const ownedDomains = data.items.filter((domain) => {
    if (domain.name === mainDomainName) {
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
        <Button
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={ onToggle }
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
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '500px' }}>
        <PopoverBody px={ 6 } py={ 5 } fontSize="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          { mainDomain && (
            <div>
              <chakra.span color="text_secondary" fontSize="xs">Primary*</chakra.span>
              <Flex alignItems="center" fontSize="md" mt={ 2 }>
                <EnsEntity name={ mainDomain.name } fontWeight={ 600 } noCopy/>
                { mainDomain.expiry_date &&
                    <chakra.span color="text_secondary" whiteSpace="pre"> (expires { dayjs(mainDomain.expiry_date).fromNow() })</chakra.span> }
              </Flex>
            </div>
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
