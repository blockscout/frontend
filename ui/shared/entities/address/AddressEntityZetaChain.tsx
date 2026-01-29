import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { SkeletonCircle } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { unknownAddress } from 'ui/shared/address/utils';
import getChainTooltipText from 'ui/shared/externalChains/getChainTooltipText';
import IconSvg from 'ui/shared/IconSvg';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

import { distributeEntityProps, getIconProps } from '../base/utils';
import * as AddressEntityBase from './AddressEntity';

interface Props extends Omit<AddressEntityBase.EntityProps, 'address'> {
  chainId?: string;
  address: { hash: string };
}

const AddressEntityZetaChain = ({ chainId, ...props }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();

  const addressFull = { ...unknownAddress, hash: props.address.hash };
  const addressEntityProps = { ...props, address: addressFull };

  const partsProps = distributeEntityProps(addressEntityProps);
  const chain = chainsConfig?.find((chain) => chain.id.toString() === chainId);

  const isCurrentChain = chainId === config.chain.id;

  const href = (() => {
    if (chain && 'address_url_template' in chain && chain.address_url_template) {
      return chain.address_url_template.replace('{hash}', props.address.hash);
    }
    return route({
      pathname: '/address/[hash]',
      query: {
        ...props.query,
        hash: props.address.hash,
      },
    }, { chain: isCurrentChain ? undefined : chain as ExternalChain, external: Boolean(chain) });
  })();

  const zetaChainIcon = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);
  const chainLogo = isCurrentChain ? zetaChainIcon : chain?.logo;
  const chainName = isCurrentChain ? config.chain.name : chain?.name;
  const iconStyles = getIconProps(partsProps.icon, false);

  const addressIcon = (() => {
    if (props.isLoading) {
      return <SkeletonCircle size={ iconStyles.boxSize } mr={ iconStyles.marginRight }/>;
    }

    const iconStub = (
      <IconSvg
        name="networks/icon-placeholder"
        boxSize={ iconStyles.boxSize }
        color="icon.primary"
        display="inline-block"
      />
    );

    if (chainLogo) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          boxSize={ iconStyles.boxSize }
          mr={ iconStyles.marginRight }
          flexShrink={ 0 }
        >
          <Image
            src={ chainLogo }
            alt={ `${ chainName } chain logo` }
            fallback={ iconStub }
            width={ iconStyles.boxSize }
            height={ iconStyles.boxSize }
            borderRadius="base"
          />
        </Flex>
      );
    }

    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        borderRadius="base"
        boxSize={ iconStyles.boxSize }
        mr={ iconStyles.marginRight }
        flexShrink={ 0 }
      >
        { iconStub }
      </Flex>
    );
  })();

  return (
    <AddressEntityBase.Container className={ props.className }>
      <Tooltip content={ getChainTooltipText(chain ? { ...chain, name: chainName ?? chain.name } : undefined, 'Address on ') }>
        { addressIcon }
      </Tooltip>
      { href ? (
        <AddressEntityBase.Link { ...partsProps.link } href={ href } external={ !isCurrentChain }>
          <AddressEntityBase.Content { ...partsProps.content }/>
        </AddressEntityBase.Link>
      ) : (
        <Box overflow="hidden">
          <AddressEntityBase.Content { ...partsProps.content }/>
        </Box>
      ) }
      <AddressEntityBase.Copy { ...partsProps.copy }/>
    </AddressEntityBase.Container>
  );
};

export default chakra(AddressEntityZetaChain);
