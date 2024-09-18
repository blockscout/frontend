import { Box, Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import IconSvg from 'ui/shared/IconSvg';

import ProfileMenuNavLink from './ProfileMenuNavLink';
import ProfileMenuWallet from './ProfileMenuWallet';
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
  onClose?: () => void;
}

const ProfileMenuContent = ({ data, onClose }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const alertBgColor = useColorModeValue('orange.100', 'orange.900');

  return (
    <Box>
      { isAutoConnectDisabled && (
        <Flex
          borderRadius="base"
          p={ 3 }
          mb={ 3 }
          alignItems="center"
          bgColor={ alertBgColor }
        >
          <IconSvg
            name="integration/partial"
            color="text"
            boxSize={ 5 }
            flexShrink={ 0 }
            mr={ 2 }
          />
          <Text fontSize="xs" lineHeight="16px">
            Connect your wallet in the app below
          </Text>
        </Flex>
      ) }

      <Flex alignItems="center" justifyContent="space-between">
        <ProfileMenuNavLink
          text="Profile"
          href={ route({ pathname: '/auth/profile' }) }
          icon="profile"
          onClick={ onClose }
        />
        { data?.email && <Text variant="secondary" fontSize="sm">{ getUserHandle(data.email) }</Text> }
      </Flex>

      <ProfileMenuWallet onClose={ onClose }/>

      <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
        { navLinks.map((item) => (
          <ProfileMenuNavLink
            key={ item.text }
            { ...item }
            onClick={ onClose }
          />
        )) }
      </VStack>

      <Divider my={ 1 }/>

      <ProfileMenuNavLink
        text="Sign out"
        icon="sign_out"
        onClick={ onClose }
      />
    </Box>
  );
};

export default React.memo(ProfileMenuContent);
