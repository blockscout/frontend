import { Box } from '@chakra-ui/react';
import { MultisenderWidget } from '@multisender.app/multisender-react-widget';
import { sepolia } from '@reown/appkit/networks';

import config from 'configs/app';
import wagmiConfig from 'lib/web3/wagmiConfig';

const feature = config.features.blockchainInteraction;

const widgetConfig = {
  [sepolia.id]: {
    id: sepolia.id,
    name: sepolia.name,
    blockExplorerUrl: {
      tx: 'https://eth-sepolia.blockscout.com/tx/',
      address: 'https://eth-sepolia.blockscout.com/address/',
    },
    multisenderContractAddress: '0x88888c037DF4527933fa8Ab203a89e1e6E58db70',
    rpcUrls: [ 'https://eth-sepolia.public.blastapi.io' ],
    blockScoutApiUrl: 'https://eth-sepolia.blockscout.com',
  },
};

const Multisender = () => {
  if (!feature.isEnabled) {
    return <div>Multisender is not enabled</div>;
  }

  return (
    <Box w="full" bgColor="oklch(0.228 0.109 269.568)" borderRadius="xl">
      <MultisenderWidget
        config={ widgetConfig }
        modalParams={{
          networks: wagmiConfig.adapter?.wagmiChains,
          projectId: wagmiConfig.adapter?.projectId,
          adapters: [ wagmiConfig.adapter ],
        }}
      />
    </Box>
  );
};

export default Multisender;
