// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { route } from 'nextjs/routes';

import type * as AddressEntityBase from 'client/slices/address/components/entity/AddressEntity';
import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { unknownAddress } from 'client/slices/address/utils/consts';

import useZetaChainConfig from 'client/features/chain-variants/zeta-chain/hooks/useZetaChainConfig';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import getChainTooltipText from 'ui/shared/externalChains/getChainTooltipText';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends Omit<AddressEntityBase.EntityProps, 'address'> {
  chainId?: string;
  address: { hash: string };
}

const AddressEntityZetaChain = ({ chainId, address, ...props }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();

  const addressFull = { ...unknownAddress, hash: address.hash };
  const chain = chainsConfig?.find((chain) => chain.id.toString() === chainId);
  const isCurrentChain = chainId === config.chain.id;

  const href = (() => {
    if (chain && 'address_url_template' in chain && chain.address_url_template) {
      return chain.address_url_template.replace('{hash}', address.hash);
    }
    return route({
      pathname: '/address/[hash]',
      query: {
        ...props.query,
        hash: address.hash,
      },
    }, { chain: isCurrentChain ? undefined : chain as ExternalChain, external: Boolean(chain) });
  })();

  const zetaChainIcon = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);
  const chainLogo = isCurrentChain ? zetaChainIcon : chain?.logo;
  const chainName = isCurrentChain ? config.chain.name : chain?.name;
  const iconStub = (
    <IconSvg
      name="networks/icon-placeholder"
      color="icon.primary"
      display="inline-block"
    />
  );

  return (
    <AddressEntity
      address={ addressFull }
      href={ href }
      icon={{
        ...(chainLogo ? { src: chainLogo, fallback: iconStub } : { name: 'networks/icon-placeholder', color: 'icon.primary' }),
        hint: getChainTooltipText(chain ? { ...chain, name: chainName ?? chain.name } : undefined, 'Address on '),
      }}
      link={{ external: !isCurrentChain }}
      { ...props }
    />
  );
};

export default chakra(AddressEntityZetaChain);
