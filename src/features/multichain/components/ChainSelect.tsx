// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import multichainConfig from 'src/features/multichain/chains-config';

import type { Props } from 'src/shared/external-chains/ChainSelect';
import ChainSelect from 'src/shared/external-chains/ChainSelect';

const ChainSelectMultichain = (props: Omit<Props, 'chainsConfig'>) => {
  const chainsConfig = React.useMemo(() => {
    return multichainConfig()?.chains || [];
  }, []);
  return <ChainSelect chainsConfig={ chainsConfig } { ...props }/>;
};

export default React.memo(ChainSelectMultichain);
