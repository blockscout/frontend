import { Box, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  onAddWallet: () => void;
}

const MyProfileWallet = ({ profileQuery, onAddWallet }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <section>
      <Heading as="h2" size="sm" mb={ 3 }>My linked wallet</Heading>
      <Text mb={ 3 } >
        This wallet address is used for login{ ' ' }
        { config.features.rewards.isEnabled && (
          <>
            and participation in the Merits Program.
            <LinkExternal href="https://docs.blockscout.com/using-blockscout/merits" ml={ 1 }>
              Learn more
            </LinkExternal>
          </>
        ) }
      </Text>
      { profileQuery.data?.address_hash ? (
        <Box px={ 3 } py="18px" bgColor={ bgColor } borderRadius="base">
          <AddressEntity
            address={{ hash: profileQuery.data.address_hash }}
            fontWeight="500"
            noAltHash
          />
        </Box>
      ) : <Button size="sm" onClick={ onAddWallet }>Link wallet</Button> }
    </section>
  );
};

export default React.memo(MyProfileWallet);
