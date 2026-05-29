// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';

import type { Props } from 'src/shared/external-chains/ChainSelect';
import ChainSelect from 'src/shared/external-chains/ChainSelect';

const ChainSelectEssentialDapps = (props: Omit<Props, 'chainsConfig'>) => {
  const chainsConfig = React.useMemo(() => {
    return essentialDappsChainsConfig()?.chains || [];
  }, []);
  return <ChainSelect chainsConfig={ chainsConfig } { ...props }/>;
};

export default React.memo(ChainSelectEssentialDapps);
