// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props } from 'client/shared/external-chains/ChainSelect';
import ChainSelect from 'client/shared/external-chains/ChainSelect';

import essentialDappsChainsConfig from 'configs/essential-dapps-chains';

const ChainSelectEssentialDapps = (props: Omit<Props, 'chainsConfig'>) => {
  const chainsConfig = React.useMemo(() => {
    return essentialDappsChainsConfig()?.chains || [];
  }, []);
  return <ChainSelect chainsConfig={ chainsConfig } { ...props }/>;
};

export default React.memo(ChainSelectEssentialDapps);
