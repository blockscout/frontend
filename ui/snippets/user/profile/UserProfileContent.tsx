import { Box, Button, Divider, Flex, Link, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import Hint from 'ui/shared/Hint';
import TruncatedValue from 'ui/shared/TruncatedValue';
import useLogout from 'ui/snippets/auth/useLogout';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';
import UserProfileContentNavLink from './UserProfileContentNavLink';
import UserProfileContentWallet from './UserProfileContentWallet';

const navLinks: Array<NavLink> = [
  {
    text: 'My profile',
    href: route({ pathname: '/auth/profile' }),
    icon: 'profile' as const,
  },
  {
    text: 'Watch list',
    href: route({ pathname: '/account/watchlist' }),
    icon: 'star_outline' as const,
  },
  {
    text: 'Private tags',
    href: route({ pathname: '/account/tag-address' }),
    icon: 'private_tags_slim' as const,
  },
  {
    text: 'API keys',
    href: route({ pathname: '/account/api-key' }),
    icon: 'API_slim' as const,
  },
  {
    text: 'Custom ABI',
    href: route({ pathname: '/account/custom-abi' }),
    icon: 'ABI_slim' as const,
  },
  config.features.addressVerification.isEnabled && {
    text: 'Verified addrs',
    href: route({ pathname: '/account/verified-addresses' }),
    icon: 'verified_slim' as const,
  },
].filter(Boolean);

interface Props {
  data: UserInfo | undefined;
  onClose: () => void;
  onLogin: () => void;
  onAddEmail: () => void;
  onAddAddress: () => void;
}

const UserProfileContent = ({ data, onClose, onLogin, onAddEmail, onAddAddress }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const logout = useLogout();

  const accountTextColor = useColorModeValue('gray.500', 'gray.300');

  if (!data) {
    return (
      <Box>
        { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
        { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose }/> }
        <Button mt={ 3 } onClick={ onLogin } size="sm" w="100%">Log in</Button>
      </Box>
    );
  }

  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }

      <Box fontSize="xs" lineHeight={ 6 } fontWeight="500" px={ 1 } mb="2px">Account</Box>
      <Box
        fontSize="xs"
        lineHeight={ 4 }
        fontWeight="500"
        borderColor="divider"
        borderWidth="1px"
        borderRadius="base"
        color={ accountTextColor }
      >
        { config.features.blockchainInteraction.isEnabled && (
          <Flex p={ 2 } borderColor="divider" borderBottomWidth="1px">
            <Box>Address</Box>
            <Hint
              label={ `This wallet address is linked to your Blockscout account. It can be used to login ${ config.features.rewards.isEnabled ? 'and is used for Merits Program participation' : '' }` } // eslint-disable-line max-len
              boxSize={ 4 }
              ml={ 1 }
              mr="auto"
            />
            { data?.address_hash ?
              <Box>{ shortenString(data?.address_hash) }</Box> :
              <Link onClick={ onAddAddress } _hover={{ color: 'link_hovered', textDecoration: 'none' }}>Add address</Link>
            }
          </Flex>
        ) }
        <Flex p={ 2 } columnGap={ 4 }>
          <Box mr="auto">Email</Box>
          { data?.email ?
            <TruncatedValue value={ data.email }/> :
            <Link onClick={ onAddEmail } _hover={{ color: 'link_hovered', textDecoration: 'none' }}>Add email</Link>
          }
        </Flex>
      </Box>

      { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose } mt={ 3 }/> }

      <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden" mt={ 4 }>
        { navLinks.map((item) => (
          <UserProfileContentNavLink
            key={ item.text }
            { ...item }
            onClick={ onClose }
          />
        )) }
      </VStack>

      <Divider my={ 1 }/>

      <UserProfileContentNavLink
        text="Sign out"
        icon="sign_out"
        onClick={ logout }
      />
    </Box>
  );
};

export default React.memo(UserProfileContent);
