import { UnorderedList, ListItem, chakra, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const VerifiedAddresses = () => {
  useRedirectForInvalidAuthToken();

  const modalProps = useDisclosure();

  return (
    <Page>
      <PageTitle text="My verified addresses"/>
      <AccountPageDescription allowCut={ false }>
        <chakra.p>
          <span>
            Before you claim the ownership of your contract address and update your token’s information, make sure that:
          </span>
          <UnorderedList>
            <ListItem>the source code has already been deployed onto the Ethereum blockchain</ListItem>
            <ListItem>the source code has already been verified (if you have not yet verified the source code, please do so using this tool)</ListItem>
          </UnorderedList>
        </chakra.p>
        <chakra.p mt={ 3 }>
            The verify address ownership process involves verifying the ownership of an “Network name” address used to create an “Network name” smart contract.
            This verification will be linked to an “Network name” account. Once a user has claimed ownership of an address,
            the user will be able to update token information and address name tags without needing to sign a new message each time.
            Find out more about verify address ownership.
        </chakra.p>
      </AccountPageDescription>
      <Button size="lg" onClick={ modalProps.onOpen }>
        Add address
      </Button>
      <AddressVerificationModal isOpen={ modalProps.isOpen } onClose={ modalProps.onClose }/>
    </Page>
  );
};

export default VerifiedAddresses;
