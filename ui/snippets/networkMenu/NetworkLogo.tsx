import { Icon, Box, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { FunctionComponent, SVGAttributes } from 'react';

import type { PreDefinedNetwork } from 'types/networks';

import appConfig from 'configs/app/config';
import blockscoutLogo from 'icons/logo.svg';
import link from 'lib/link/link';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

// predefined network logos
const LOGOS: Partial<Record<PreDefinedNetwork, React.FunctionComponent<React.SVGAttributes<SVGElement>>>> = {
  xdai_mainnet: require('icons/networks/logos/gnosis.svg'),
  eth_mainnet: require('icons/networks/logos/eth.svg'),
  etc_mainnet: require('icons/networks/logos/etc.svg'),
  poa_core: require('icons/networks/logos/poa.svg'),
  rsk_mainnet: require('icons/networks/logos/rsk.svg'),
  xdai_testnet: require('icons/networks/logos/gnosis.svg'),
  poa_sokol: require('icons/networks/logos/sokol.svg'),
  artis_sigma1: require('icons/networks/logos/artis.svg'),
  lukso_l14: require('icons/networks/logos/lukso.svg'),
  astar: require('icons/networks/logos/astar.svg'),
  shiden: require('icons/networks/logos/shiden.svg'),
  shibuya: require('icons/networks/logos/shibuya.svg'),
};

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {
  const logoColor = useColorModeValue('blue.600', 'white');
  const href = link('network_index');
  const logo = appConfig.network.logo || (appConfig.network.type ? LOGOS[appConfig.network.type] : undefined);

  const style = useColorModeValue({}, { filter: 'brightness(0) invert(1)' });

  let logoEl;

  if (logo && typeof logo === 'string') {
    logoEl = (
      <Image
        w="auto"
        h="100%"
        src={ logo }
        alt={ `${ appConfig.network.name } network icon` }
      />
    );
  } else if (typeof logo !== 'undefined') {
    logoEl = (
      <Icon
        as={ logo as FunctionComponent<SVGAttributes<SVGElement>> }
        width="auto"
        height="100%"
        { ...getDefaultTransitionProps() }
        style={ style }
      />
    );
  } else {
    logoEl = (
      <Icon
        as={ blockscoutLogo }
        width="auto"
        height="100%"
        color={ logoColor }
        { ...getDefaultTransitionProps() }
        style={ style }
      />
    );
  }

  return (
    // TODO switch to <NextLink href={ href } passHref> when main page for network will be ready
    <Box
      as="a"
      href={ href }
      width={{ base: 'auto', lg: isCollapsed === false ? '113px' : 0, xl: isCollapsed ? '0' : '113px' }}
      height="20px"
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
      aria-label="Link to main page"
    >
      { logoEl }
    </Box>
  );
};

export default React.memo(NetworkLogo);
