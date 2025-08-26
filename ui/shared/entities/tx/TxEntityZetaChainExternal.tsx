import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs/routes';

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
      return chain.instance_url.replace(/\/$/, '') + route({ pathname: '/tx/[hash]', query: { hash: props.hash } });
    }
    if (chain?.tx_url_template) {
      return chain.tx_url_template.replace('{hash}', props.hash);
    }
    return;
  })();

  return <TxEntity.default { ...props } icon={{ name: 'interop', boxSize: 6, marginRight: 1 }} href={ props.href ?? defaultHref } isExternal/>;
};

export default chakra(TxEntityZetaChainExternal);
