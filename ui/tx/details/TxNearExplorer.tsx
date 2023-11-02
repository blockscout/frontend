import {
  Text,
} from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import * as EntityBase from 'ui/shared/entities/base/components';

const explorerLink = (hash: string): string => {
  const target = config.chain.nearNetwork === 'mainnet' ? '' : 'testnet.';

  return `https://${ target }nearblocks.io/txns/${ hash }`;
};

interface Props {
  hash: string;
  isLink?: boolean;
}

const TxNearExplorer = ({ hash, isLink = false }: Props) => {
  return (
    <EntityBase.Container>
      { isLink ? (
        <EntityBase.Link
          href={ explorerLink(hash) }
          isExternal
        >
          { hash }
        </EntityBase.Link>
      ) : (
        <Text>
          { hash }
        </Text>
      ) }
      <EntityBase.Copy
        text={ hash }
      />
    </EntityBase.Container>
  );
};

export default TxNearExplorer;
