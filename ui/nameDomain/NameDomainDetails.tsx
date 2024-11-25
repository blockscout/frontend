import { Grid, Skeleton, Tooltip, Flex } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';

import NameDomainDetailsAlert from './details/NameDomainDetailsAlert';
import NameDomainExpiryStatus from './NameDomainExpiryStatus';

interface Props {
  query: UseQueryResult<bens.DetailedDomain, ResourceError<unknown>>;
}

const NameDomainDetails = ({ query }: Props) => {
  const isLoading = query.isPlaceholderData;

  const otherAddresses = Object.entries(query.data?.other_addresses ?? {});
  const hasExpired = query.data?.expiry_date && dayjs(query.data.expiry_date).isBefore(dayjs());

  return (
    <>
      <NameDomainDetailsAlert data={ query.data }/>
      <Grid columnGap={ 8 } rowGap={ 3 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
        { query.data?.registration_date && (
          <>
            <DetailsInfoItem.Label
              hint="The date the name was registered"
              isLoading={ isLoading }
            >
              Registration date
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
              <IconSvg name="clock" boxSize={ 5 } color="gray.500" verticalAlign="middle" isLoading={ isLoading } mr={ 2 }/>
              <Skeleton isLoaded={ !isLoading } display="inline" whiteSpace="pre-wrap" lineHeight="20px">
                { dayjs(query.data.registration_date).format('llll') }
              </Skeleton>
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.expiry_date && (
          <>
            <DetailsInfoItem.Label
            // eslint-disable-next-line max-len
              hint="The date the name expires, upon which there is a 90 day grace period for the owner to renew. After the 90 days, the name is released to the market"
              isLoading={ isLoading }
            >
              Expiration date
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.resolver_address && (
          <>
            <DetailsInfoItem.Label
              hint="The resolver contract provides information about a domain name"
              isLoading={ isLoading }
            >
              Resolver
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value
            >
              <AddressEntity
                address={ query.data.resolver_address }
                isLoading={ isLoading }
              />
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.registrant && (
          <>
            <DetailsInfoItem.Label
              hint="The account that owns the domain name and has the rights to edit its ownership and records"
              isLoading={ isLoading }
            >
              Registrant
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.owner && (
          <>
            <DetailsInfoItem.Label
              hint="The account that owns the rights to edit the records of this domain name"
              isLoading={ isLoading }
            >
              Owner
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.wrapped_owner && (
          <>
            <DetailsInfoItem.Label
              hint="Owner of this NFT domain in NameWrapper contract"
              isLoading={ isLoading }
            >
              Manager
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { query.data?.tokens.map((token) => {
          const isProtocolBaseChain = stripTrailingSlash(query.data.protocol?.deployment_blockscout_base_url ?? '') === config.app.baseUrl;
          const entityProps = {
            isExternal: !isProtocolBaseChain ? true : false,
            href: !isProtocolBaseChain ? (
              stripTrailingSlash(query.data.protocol?.deployment_blockscout_base_url ?? '') +
            route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.contract_hash, id: token.id } })
            ) : undefined,
          };

          return (
            <React.Fragment key={ token.type }>
              <DetailsInfoItem.Label
                hint={ `The ${ token.type === bens.TokenType.WRAPPED_DOMAIN_TOKEN ? 'wrapped ' : '' }token ID of this domain name NFT` }
                isLoading={ isLoading }
              >
                { token.type === bens.TokenType.WRAPPED_DOMAIN_TOKEN ? 'Wrapped token ID' : 'Token ID' }
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value
                wordBreak="break-all"
                whiteSpace="pre-wrap"
              >
                <NftEntity { ...entityProps } hash={ token.contract_hash } id={ token.id } isLoading={ isLoading } noIcon/>
              </DetailsInfoItem.Value>
            </React.Fragment>
          );
        }) }

        { otherAddresses.length > 0 && (
          <>
            <DetailsInfoItem.Label
              hint="Other cryptocurrency addresses added to this domain name"
              isLoading={ isLoading }
            >
              Other addresses
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value
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
            </DetailsInfoItem.Value>
          </>
        ) }
      </Grid>
    </>
  );
};

export default React.memo(NameDomainDetails);
