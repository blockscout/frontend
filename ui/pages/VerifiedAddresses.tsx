import { OrderedList, ListItem, chakra, Button, useDisclosure, Show, Hide, Skeleton, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { VerifiedAddress, TokenInfoApplication, TokenInfoApplications, VerifiedAddressResponse } from 'types/api/account';

import appConfig from 'configs/app/config';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonListAccount from 'ui/shared/skeletons/SkeletonListAccount';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import TokenInfoForm from 'ui/tokenInfo/TokenInfoForm';
import VerifiedAddressesListItem from 'ui/verifiedAddresses/VerifiedAddressesListItem';
import VerifiedAddressesTable from 'ui/verifiedAddresses/VerifiedAddressesTable';

const VerifiedAddresses = () => {
  useRedirectForInvalidAuthToken();

  const [ selectedAddress, setSelectedAddress ] = React.useState<string>();

  const modalProps = useDisclosure();
  const addressesQuery = useApiQuery('verified_addresses', {
    pathParams: { chainId: appConfig.network.id },
  });
  const applicationsQuery = useApiQuery('token_info_applications', {
    pathParams: { chainId: appConfig.network.id },
  });
  const queryClient = useQueryClient();

  const handleGoBack = React.useCallback(() => {
    setSelectedAddress(undefined);
  }, []);

  const handleItemAdd = React.useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);
  const handleItemEdit = React.useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);

  const handleAddressSubmit = React.useCallback((newItem: VerifiedAddress) => {
    queryClient.setQueryData(
      getResourceKey('verified_addresses', { pathParams: { chainId: appConfig.network.id } }),
      (prevData: VerifiedAddressResponse | undefined) => {
        if (!prevData) {
          return { verifiedAddresses: [ newItem ] };
        }

        return {
          verifiedAddresses: [ newItem, ...prevData.verifiedAddresses ],
        };
      });
  }, [ queryClient ]);

  const handleApplicationSubmit = React.useCallback((newItem: TokenInfoApplication) => {
    queryClient.setQueryData(
      getResourceKey('token_info_applications', { pathParams: { chainId: appConfig.network.id } }),
      (prevData: TokenInfoApplications | undefined) => {
        if (!prevData) {
          return { submissions: [ newItem ] };
        }

        const submissions = prevData.submissions.map((item) => item.id === newItem.id ? newItem : item);
        return { submissions };
      });
  }, [ queryClient ]);

  const addButton = (
    <Box marginTop={ 8 }>
      <Button size="lg" onClick={ modalProps.onOpen }>
          Add address
      </Button>
    </Box>
  );

  const skeleton = (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        <SkeletonListAccount/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <SkeletonTable columns={ [ '100%', '180px', '260px', '160px' ] }/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </Box>
    </>
  );

  const backLink = React.useMemo(() => {
    if (!selectedAddress) {
      return;
    }

    return {
      label: 'Back to my verified addresses',
      onClick: handleGoBack,
    };
  }, [ handleGoBack, selectedAddress ]);

  if (selectedAddress) {
    return (
      <Page>
        <PageTitle text="Token info application form" backLink={ backLink }/>
        <TokenInfoForm
          address={ selectedAddress }
          application={ applicationsQuery.data?.submissions.find(({ tokenAddress }) => tokenAddress === selectedAddress) }
          onSubmit={ handleApplicationSubmit }
        />
      </Page>
    );
  }

  const content = addressesQuery.data?.verifiedAddresses ? (
    <>
      <Show below="lg" key="content-mobile" ssr={ false }>
        { data.verifiedAddresses.map((item) => (
          <VerifiedAddressesListItem
            key={ item.contractAddress }
            item={ item }
            onAdd={ handleItemAdd }
            onEdit={ handleItemEdit }
          />
        )) }
      </Show>
      <Hide below="lg" key="content-desktop" ssr={ false }>
        <VerifiedAddressesTable
          data={ addressesQuery.data.verifiedAddresses }
          applications={ applicationsQuery.data?.submissions }
          onItemEdit={ handleItemEdit }
          onItemAdd={ handleItemAdd }
        />
      </Hide>
    </>
  ) : null;

  return (
    <Page>
      <PageTitle text="My verified addresses"/>
      <AccountPageDescription allowCut={ false }>
        <span>
          Verify ownership of a smart contract address to easily update information in Blockscout.
          You will sign a single message to verify contract ownership.
          Once verified, you can update token information, address name tags, and address labels from the
          Blockscout console without needing to sign additional messages.
        </span>
        <chakra.p fontWeight={ 600 } mt={ 5 }>
          Before starting, make sure that:
        </chakra.p>
        <OrderedList>
          <ListItem>The source code for the smart contract is deployed on “Network Name”.</ListItem>
          <ListItem>The source code is verified (if not yet verified, you can use this tool).</ListItem>
        </OrderedList>
        <chakra.div mt={ 5 }>
          Once these steps are complete, click the Add address button below to get started.
        </chakra.div>
      </AccountPageDescription>
      <DataListDisplay
        isLoading={ addressesQuery.isLoading || applicationsQuery.isLoading }
        isError={ addressesQuery.isError || applicationsQuery.isError }
        items={ addressesQuery.data?.verifiedAddresses }
        content={ content }
        emptyText=""
        skeletonProps={{ customSkeleton: skeleton }}
      />
      { addButton }
      <AddressVerificationModal isOpen={ modalProps.isOpen } onClose={ modalProps.onClose } onSubmit={ handleAddressSubmit }/>
    </Page>
  );
};

export default VerifiedAddresses;
