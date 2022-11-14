import { Icon, Box, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { FunctionComponent, SVGAttributes } from 'react';

import type { PreDefinedNetwork } from 'types/networks';

import appConfig from 'configs/app/config';
import blockscoutLogo from 'icons/logo.svg';
import artisLogo from 'icons/networks/logos/artis.svg';
import astarLogo from 'icons/networks/logos/astar.svg';
import etcLogo from 'icons/networks/logos/etc.svg';
import ethLogo from 'icons/networks/logos/eth.svg';
import gnosisLogo from 'icons/networks/logos/gnosis.svg';
import luksoLogo from 'icons/networks/logos/lukso.svg';
import poaLogo from 'icons/networks/logos/poa.svg';
import rskLogo from 'icons/networks/logos/rsk.svg';
import shibuyaLogo from 'icons/networks/logos/shibuya.svg';
import shidenLogo from 'icons/networks/logos/shiden.svg';
import sokolLogo from 'icons/networks/logos/sokol.svg';
import link from 'lib/link/link';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

// predefined network logos
const LOGOS: Partial<Record<PreDefinedNetwork, React.FunctionComponent<React.SVGAttributes<SVGElement>>>> = {
  xdai_mainnet: gnosisLogo,
  eth_mainnet: ethLogo,
  etc_mainnet: etcLogo,
  poa_core: poaLogo,
  rsk_mainnet: rskLogo,
  xdai_testnet: gnosisLogo,
  poa_sokol: sokolLogo,
  artis_sigma1: artisLogo,
  lukso_l14: luksoLogo,
  astar: astarLogo,
  shiden: shidenLogo,
  shibuya: shibuyaLogo,
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
