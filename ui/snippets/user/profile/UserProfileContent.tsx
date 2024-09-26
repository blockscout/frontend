import { Box, Button, Divider, Flex, Link, VStack } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import Hint from 'ui/shared/Hint';
import useLogout from 'ui/snippets/auth/useLogout';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';
import UserProfileContentNavLink from './UserProfileContentNavLink';
import UserProfileContentWallet from './UserProfileContentWallet';
import { getUserHandle } from './utils';

const navLinks: Array<NavLink> = [
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

      <UserProfileContentNavLink
        text="My profile"
        href={ route({ pathname: '/auth/profile' }) }
        icon="profile"
        onClick={ onClose }
        py="8px"
      />

      <Box fontSize="xs" lineHeight={ 4 } fontWeight="500" borderColor="divider" borderWidth="1px" borderRadius="base">
        <Flex p={ 2 } borderColor="divider" borderBottomWidth="1px">
          <Box>Address</Box>
          <Hint label="Address" boxSize={ 4 } ml={ 1 } mr="auto"/>
          { data?.address_hash ?
            <Box>{ shortenString(data?.address_hash) }</Box> :
            <Link onClick={ onAddAddress } color="text_secondary" _hover={{ color: 'link_hovered', textDecoration: 'none' }}>Add wallet</Link>
          }
        </Flex>
        <Flex p={ 2 }>
          <Box mr="auto">Email</Box>
          { data?.email ?
            <Box>{ getUserHandle(data.email) }</Box> :
            <Link onClick={ onAddEmail } color="text_secondary" _hover={{ color: 'link_hovered', textDecoration: 'none' }}>Add email</Link>
          }
        </Flex>
      </Box>

      { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose } mt={ 3 }/> }

      <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden" mt={ 3 }>
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
