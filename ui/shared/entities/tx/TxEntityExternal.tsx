import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { stripTrailingSlash } from 'toolkit/utils/url';

import * as TxEntity from './TxEntity';

interface Props extends TxEntity.EntityProps {
  chain: ExternalChain | undefined;
}

const TxEntityExternal = ({ chain, ...props }: Props) => {

  const defaultHref = (() => {
    if (!chain) {
      return;
    }

    try {
      const url = new URL(
        stripTrailingSlash(chain.explorer_url) +
            (chain.route_templates?.tx || '/tx/{hash}').replace('{hash}', props.hash),
      );
      return url.toString();
    } catch (error) {}
  })();

  const href = props.href ?? defaultHref;

  return (
    <TxEntity.default
      { ...props }
      href={ href }
      noLink={ props.noLink || !href }
      link={{ external: true }}
    />
  );
};

export default chakra(TxEntityExternal);
