import { Grid, Skeleton, Tooltip, Flex } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { EnsDomainDetailed } from 'types/api/ens';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';

import NameDomainExpiryStatus from './NameDomainExpiryStatus';

interface Props {
  query: UseQueryResult<EnsDomainDetailed, ResourceError<unknown>>;
}

const NameDomainDetails = ({ query }: Props) => {
  const isLoading = query.isPlaceholderData;

  const otherAddresses = Object.entries(query.data?.other_addresses ?? {});
  const hasExpired = query.data?.expiry_date && dayjs(query.data.expiry_date).isBefore(dayjs());

  return (
    <Grid columnGap={ 8 } rowGap={ 3 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
      { query.data?.registration_date && (
        <DetailsInfoItem
          title="Registration date"
          hint="The date the name was registered"
          isLoading={ isLoading }
        >
          <IconSvg name="clock" boxSize={ 5 } color="gray.500" verticalAlign="middle" isLoading={ isLoading } mr={ 2 }/>
          <Skeleton isLoaded={ !isLoading } display="inline" whiteSpace="pre-wrap" lineHeight="20px">
            { dayjs(query.data.registration_date).format('llll') }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { query.data?.expiry_date && (
        <DetailsInfoItem
          title="Expiration date"
          // eslint-disable-next-line max-len
          hint="The date the name expires, upon which there is a 90 day grace period for the owner to renew. After the 90 days, the name is released to the market"
          isLoading={ isLoading }
          display="inline-block"
        >
          <IconSvg name="clock" boxSize={ 5 } color="gray.500" verticalAlign="middle" isLoading={ isLoading } mr={ 2 } mt="-2px"/>
          { hasExpired && (
            <>
              <Skeleton isLoaded={ !isLoading } display="inline" whiteSpace="pre-wrap" lineHeight="24px">
                { dayjs(query.data.expiry_date).fromNow() }
              </Skeleton>
              <TextSeparator color="gray.500"/>
            </>
          ) }
          <Skeleton isLoaded={ !isLoading } display="inline" whiteSpace="pre-wrap" lineHeight="24px">
            { dayjs(query.data.expiry_date).format('llll') }
          </Skeleton>
          <TextSeparator color="gray.500"/>
          <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline">
            <NameDomainExpiryStatus date={ query.data?.expiry_date }/>
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { query.data?.registrant && (
        <DetailsInfoItem
          title="Registrant"
          hint="The account that owns the domain name and has the rights to edit its ownership and records"
          isLoading={ isLoading }
          columnGap={ 2 }
          flexWrap="nowrap"
        >
          <AddressEntity
            address={ query.data.registrant }
            isLoading={ isLoading }
          />
          <Tooltip label="Lookup for related domain names">
            <LinkInternal
              flexShrink={ 0 }
              display="inline-flex"
              href={ route({ pathname: '/name-domains', query: { owned_by: 'true', resolved_to: 'true', address: query.data.registrant.hash } }) }
            >
              <IconSvg name="search" boxSize={ 5 } isLoading={ isLoading }/>
            </LinkInternal>
          </Tooltip>
        </DetailsInfoItem>
      ) }
      { query.data?.owner && (
        <DetailsInfoItem
          title="Owner"
          hint="The account that owns the rights to edit the records of this domain name"
          isLoading={ isLoading }
          columnGap={ 2 }
          flexWrap="nowrap"
        >
          <AddressEntity
            address={ query.data.owner }
            isLoading={ isLoading }
          />
          <Tooltip label="Lookup for related domain names">
            <LinkInternal
              flexShrink={ 0 }
              display="inline-flex"
              href={ route({ pathname: '/name-domains', query: { owned_by: 'true', resolved_to: 'true', address: query.data.owner.hash } }) }
            >
              <IconSvg name="search" boxSize={ 5 } isLoading={ isLoading }/>
            </LinkInternal>
          </Tooltip>
        </DetailsInfoItem>
      ) }
      { query.data?.wrapped_owner && (
        <DetailsInfoItem
          title="Manager"
          hint="Owner of this NFT domain in NameWrapper contract"
          isLoading={ isLoading }
          columnGap={ 2 }
          flexWrap="nowrap"
        >
          <AddressEntity
            address={ query.data.wrapped_owner }
            isLoading={ isLoading }
          />
          <Tooltip label="Lookup for related domain names">
            <LinkInternal
              flexShrink={ 0 }
              display="inline-flex"
              href={ route({ pathname: '/name-domains', query: { owned_by: 'true', resolved_to: 'true', address: query.data.wrapped_owner.hash } }) }
            >
              <IconSvg name="search" boxSize={ 5 } isLoading={ isLoading }/>
            </LinkInternal>
          </Tooltip>
        </DetailsInfoItem>
      ) }
      { query.data?.tokens.map((token) => (
        <DetailsInfoItem
          key={ token.type }
          title={ token.type === 'WRAPPED_DOMAIN_TOKEN' ? 'Wrapped token ID' : 'Token ID' }
          hint={ `The ${ token.type === 'WRAPPED_DOMAIN_TOKEN' ? 'wrapped ' : '' }token ID of this domain name NFT` }
          isLoading={ isLoading }
          wordBreak="break-all"
          whiteSpace="pre-wrap"
        >
          <NftEntity hash={ token.contract_hash } id={ token.id } isLoading={ isLoading } noIcon/>
        </DetailsInfoItem>
      )) }
      { otherAddresses.length > 0 && (
        <DetailsInfoItem
          title="Other addresses"
          hint="Other cryptocurrency addresses added to this domain name"
          isLoading={ isLoading }
          flexDir="column"
          alignItems="flex-start"
        >
          { otherAddresses.map(([ type, address ]) => (
            <Flex key={ type } columnGap={ 2 } minW="0" w="100%" overflow="hidden">
              <Skeleton isLoaded={ !isLoading }>{ type }</Skeleton>
              <AddressEntity
                address={{ hash: address }}
                isLoading={ isLoading }
                noLink
                noIcon
              />
            </Flex>
          )) }
        </DetailsInfoItem>
      ) }
    </Grid>
  );
};

export default React.memo(NameDomainDetails);
