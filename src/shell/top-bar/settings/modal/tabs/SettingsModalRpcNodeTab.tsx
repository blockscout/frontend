// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsRpcNode from '../../fields/rpc-node/SettingsRpcNode';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

// eslint-disable-next-line max-len
const DESCRIPTION = 'Contract reads and writes made from your browser go through a default public RPC node. Add your own node url if the default is slow, rate-limited, or you want more privacy. Blocks, transactions, balances, and other indexed data still come from the Blockscout API. HTTPS only. To go back to the default, clear the field and save.';

const SettingsModalRpcNodeTab = () => {
  const isMobile = useIsMobile();
  return (
    <>
      { isMobile ?
        <Text textStyle="sm" mb={ 3 }>{ DESCRIPTION }</Text> :
        <SettingsSectionTitle title="RPC node" description={ DESCRIPTION } variant="modal"/> }
      <SettingsRpcNode/>
    </>
  );
};

export default React.memo(SettingsModalRpcNodeTab);
