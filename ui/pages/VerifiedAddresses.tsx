import { UnorderedList, ListItem, chakra, Button, useDisclosure, Show, Hide, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonListAccount from 'ui/shared/skeletons/SkeletonListAccount';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import VerifiedAddressesTable from 'ui/verifiedAddresses/VerifiedAddressesTable';

const VerifiedAddresses = () => {
  useRedirectForInvalidAuthToken();

  const modalProps = useDisclosure();
  const { data, isLoading, isError } = useApiQuery('verified_addresses', {
    pathParams: { chainId: appConfig.network.id },
  });

  const handleItemEdit = React.useCallback(() => {}, []);
  const handleItemDelete = React.useCallback(() => {}, []);

  const addButton = (
    <Button size="lg" onClick={ modalProps.onOpen } marginTop={ 8 }>
        Add address
    </Button>
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

  const content = data?.verifiedAddresses ? (
    <>
      <Show below="lg" key="content-mobile" ssr={ false }>
        mobile view
        { addButton }
      </Show>
      <Hide below="lg" key="content-desktop" ssr={ false }>
        <VerifiedAddressesTable data={ data.verifiedAddresses } onItemEdit={ handleItemEdit } onItemDelete={ handleItemDelete }/>
        { addButton }
      </Hide>
    </>
  ) : null;

  return (
    <Page>
      <PageTitle text="My verified addresses"/>
      <AccountPageDescription allowCut={ false }>
        <span>Before you claim the ownership of your contract address and update your token’s information, make sure that:</span>
        <UnorderedList>
          <ListItem>the source code has already been deployed onto the Ethereum blockchain</ListItem>
          <ListItem>the source code has already been verified (if you have not yet verified the source code, please do so using this tool)</ListItem>
        </UnorderedList>
        <chakra.div mt={ 3 }>
            The verify address ownership process involves verifying the ownership of an “Network name” address used to create an “Network name” smart contract.
            This verification will be linked to an “Network name” account. Once a user has claimed ownership of an address,
            the user will be able to update token information and address name tags without needing to sign a new message each time.
            Find out more about verify address ownership.
        </chakra.div>
      </AccountPageDescription>
      <DataListDisplay
        isLoading={ isLoading }
        isError={ isError }
        items={ data?.verifiedAddresses }
        content={ content }
        emptyText=""
        skeletonProps={{ customSkeleton: skeleton }}
      />
      <AddressVerificationModal isOpen={ modalProps.isOpen } onClose={ modalProps.onClose }/>
    </Page>
  );
};

export default VerifiedAddresses;
