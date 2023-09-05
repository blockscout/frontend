import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import iconFlashlight from 'icons/flashlight.svg';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import AddressActionButtons from 'ui/shared/AddressActionButtons';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressPageTitle = ({ addressQuery }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const isLoading = addressQuery.isPlaceholderData;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titlePrefix = addressQuery.data?.is_contract ? 'Contract ' : 'Address ';

  const actionButtons = (
    <AddressActionButtons
      address={ addressQuery.data }
      token={ addressQuery.data?.token }
      isLoading={ isLoading }
    />
  );
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const bottomRow = (() => {
    if (addressQuery.data?.token) {
      return (
        <PageTitle.BottomRow
          flexWrap="wrap"
          columnGap={ 6 }
        >
          <Flex
            alignItems="center"
            fontSize="lg"
            lineHeight={ 6 }
            fontWeight={ 500 }
            w={{ base: '100%', lg: 'auto' }}
          >
            <TokenEntity
              token={ addressQuery.data.token }
              isLoading={ isLoading }
              noCopy
              jointSymbol
              maxW="600px"
            />
            { addressQuery.data.token.exchange_rate && (
              <Skeleton isLoaded={ !isLoading } ml={ 1 }>
                { `$${ Number(addressQuery.data.token.exchange_rate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }` }
              </Skeleton>
            ) }
          </Flex>
          { actionButtons }
        </PageTitle.BottomRow>
      );
    }

    if (addressQuery.data?.is_contract && addressQuery.data?.name) {
      return (
        <PageTitle.BottomRow columnGap={ 6 } flexWrap="wrap">
          <Flex alignItems="center" maxW={{ base: '100%', lg: '600px' }}>
            <Icon as={ iconFlashlight } boxSize={ 5 } isLoading={ isLoading } color={ iconColor }/>
            <TruncatedValue
              fontFamily="heading"
              fontSize="lg"
              fontWeight={ 500 }
              ml={ 2 }
              value={ `Name: ${ addressQuery.data.name }` }
              isLoading={ isLoading }
            />
          </Flex>
          { actionButtons }
        </PageTitle.BottomRow>
      );
    }

    return (
      <PageTitle.BottomRow>
        { actionButtons }
      </PageTitle.BottomRow>
    );
  })();

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          <AddressEntity
            address={ addressQuery.data }
            isLoading={ isLoading }
            iconSize="lg"
            variant="page-title"
            prefix={ !isMobile ? titlePrefix : undefined }
            truncation="constant"
            noLink
            noName
          />
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent>
          <Flex columnGap={ 2 }>
            <EntityTags
              data={ addressQuery.data }
              isLoading={ isLoading }
              tagsBefore={ [
                addressQuery.data?.is_contract ? { label: 'contract', display_name: 'Contract' } : { label: 'eoa', display_name: 'EOA' },
                addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
                addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
              ] }
            />
          </Flex>
          <NetworkExplorers
            type="address"
            pathParam={ addressQuery.data?.hash }
            ml="auto"
            isLoading={ isLoading }
          />
        </PageTitle.SecondaryContent>
      </PageTitle.MainRow>
      { bottomRow }
    </PageTitle.Container>
  );
};

export default React.memo(AddressPageTitle);
