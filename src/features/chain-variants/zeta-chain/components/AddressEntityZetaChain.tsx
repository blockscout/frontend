// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import type * as AddressEntityBase from 'src/slices/address/components/entity/AddressEntity';
import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { toAddressModel } from 'src/slices/address/utils/model';

import useZetaChainConfig from 'src/features/chain-variants/zeta-chain/hooks/useZetaChainConfig';

import config from 'src/config';
import getChainTooltipText from 'src/shared/external-chains/get-chain-tooltip-text';
import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';

interface Props extends Omit<AddressEntityBase.EntityProps, 'address'> {
  chainId?: string;
  address: { hash: string };
}

const AddressEntityZetaChain = ({ chainId, address, ...props }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();

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

  const zetaChainIcon = useColorModeValue(config.chain.icon['default'], config.chain.icon.dark || config.chain.icon['default']);
  const chainLogo = isCurrentChain ? zetaChainIcon : chain?.logo;
  const chainName = isCurrentChain ? config.chain.name : chain?.name;
  const iconStub = (
    <SpriteIcon
      name="networks/icon-placeholder"
      color="icon.primary"
      display="inline-block"
    />
  );

  return (
    <AddressEntity
      address={ toAddressModel(address) }
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
