import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { SkeletonCircle } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { stripTrailingSlash } from 'toolkit/utils/url';
import { unknownAddress } from 'ui/shared/address/utils';
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
  const chain = chainsConfig?.find((chain) => chain.chain_id.toString() === chainId);

  const isCurrentChain = chainId === config.chain.id;

  const href = (() => {
    const blockscoutAddressRoute = route({
      pathname: '/address/[hash]',
      query: {
        ...props.query,
        hash: props.address.hash,
      },
    });
    if (isCurrentChain) {
      return blockscoutAddressRoute;
    }
    if (chain?.instance_url) {
      return stripTrailingSlash(chain.instance_url) + blockscoutAddressRoute;
    }
    if (chain?.address_url_template) {
      return chain.address_url_template.replace('{hash}', props.address.hash);
    }
    return null;
  })();

  const zetaChainIcon = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);
  const chainLogo = isCurrentChain ? zetaChainIcon : chain?.chain_logo;
  const chainName = isCurrentChain ? config.chain.name : chain?.chain_name;
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
      <Tooltip content={ `Address on ${ chainName } (Chain ID ${ chainId })` }>
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
