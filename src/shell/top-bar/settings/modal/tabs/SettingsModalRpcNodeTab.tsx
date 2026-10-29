// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsRpcNode from '../../fields/rpc-node/SettingsRpcNode';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

const DESCRIPTION = 'We recommend using an RPC that matches your selected network to ensure accurate data. ' +
  'Enter the node URL and click Save to update. Leave blank to use the default RPC node.';

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
