import { Box, Divider, Flex, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
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
  data: UserInfo;
  onClose: () => void;
  onAddEmail: () => void;
}

const UserProfileContent = ({ data, onClose, onAddEmail }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const logout = useLogout();

  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }

      <Flex alignItems="center" justifyContent="space-between">
        <UserProfileContentNavLink
          text="Profile"
          href={ route({ pathname: '/auth/profile' }) }
          icon="profile"
          onClick={ onClose }
        />
        { data?.email ?
          <Text variant="secondary" fontSize="sm">{ getUserHandle(data.email) }</Text> :
          <Link onClick={ onAddEmail } color="text_secondary" fontSize="sm" _hover={{ color: 'link_hovered', textDecoration: 'none' }}>Add email</Link>
        }
      </Flex>

      { config.features.blockchainInteraction.isEnabled ? <UserProfileContentWallet onClose={ onClose }/> : <Divider/> }

      <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
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
