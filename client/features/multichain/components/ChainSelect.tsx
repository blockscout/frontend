// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props } from 'client/shared/external-chains/ChainSelect';
import ChainSelect from 'client/shared/external-chains/ChainSelect';

import multichainConfig from 'configs/multichain';

const ChainSelectMultichain = (props: Omit<Props, 'chainsConfig'>) => {
  const chainsConfig = React.useMemo(() => {
    return multichainConfig()?.chains || [];
  }, []);
  return <ChainSelect chainsConfig={ chainsConfig } { ...props }/>;
};

export default React.memo(ChainSelectMultichain);
