import { Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import type { CosmosHashType } from 'lib/address/cosmos';
import { Link } from 'toolkit/chakra/link';

const zetaChainFeature = config.features.zetachain;

interface Props {
  cosmosHash: string;
  type: CosmosHashType;
}

const SearchCosmosNotice = ({ cosmosHash, type }: Props) => {
  if (!zetaChainFeature.isEnabled || !type) {
    return null;
  }

  const url = (() => {
    if (type === 'tx') {
      return zetaChainFeature.cosmosTxUrlTemplate.replace('{hash}', cosmosHash);
    }

    return zetaChainFeature.cosmosAddressUrlTemplate.replace('{hash}', cosmosHash);
  })();

  return (
    <>
      <Text color="text.secondary">
        It looks like you are searching for a Cosmos SDK style hash. This information is best served by the external explorer.
      </Text>
      <Link href={ url } external mt={ 4 }>
        Click here to be redirected
      </Link>
    </>
  );
};

export default React.memo(SearchCosmosNotice);
