import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs/routes';

import { stripTrailingSlash } from 'toolkit/utils/url';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

import * as TxEntity from './TxEntity';

type Props = {
  chainId: string;
} & Omit<TxEntity.EntityProps, 'chain'>;

const TxEntityZetaChainExternal = (props: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chain = chainsConfig?.find((chain) => chain.chain_id.toString() === props.chainId);

  const defaultHref = (() => {
    if (chain?.instance_url) {
      return stripTrailingSlash(chain.instance_url) + route({ pathname: '/tx/[hash]', query: { hash: props.hash } });
    }
    if (chain?.tx_url_template) {
      return chain.tx_url_template.replace('{hash}', props.hash);
    }
    return;
  })();

  return <TxEntity.default { ...props } href={ props.href ?? defaultHref } link={{ external: true }}/>;
};

export default chakra(TxEntityZetaChainExternal);
