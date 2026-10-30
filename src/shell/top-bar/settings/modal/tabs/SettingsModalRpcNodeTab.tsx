// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsRpcNode from '../../fields/rpc-node/SettingsRpcNode';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

const DESCRIPTION = 'Requests made directly from your browser, such as contract reads and writes, go through a public RPC node. ' +
  'Use your own node if the default one is slow, rate-limited, or you want to keep requests private. ' +
  'Indexed data such as blocks, transactions and balances still comes from the Blockscout API. ' +
  'HTTPS only. Clear the field and save to go back to the default.';

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
