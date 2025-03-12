import { Button } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel/index';
import useAddOrSwitchChain from 'lib/web3/useAddOrSwitchChain';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import IconSvg from 'ui/shared/IconSvg';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

const feature = config.features.web3Wallet;

const NetworkAddToWallet = () => {
  const toast = useToast();
  const { provider, wallet } = useProvider();
  const addOrSwitchChain = useAddOrSwitchChain();
  const { t } = useTranslation('common');

  const handleClick = React.useCallback(async () => {
    if (!wallet || !provider) {
      return;
    }

    try {
      await addOrSwitchChain();

      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Successfully added network to your wallet',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });

      mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
        Target: 'network',
        Wallet: wallet,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [addOrSwitchChain, provider, toast, wallet]);

  if (!provider || !wallet || !config.chain.rpcUrl || !feature.isEnabled) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      {/* <IconSvg name={WALLETS_INFO[wallet].icon} boxSize={5} mr={2} /> */}
      <span className="flex items-center gap-x-2">
        <FaGlobe size={16} title="加入公网" />
        {t('Add')} {config.chain.name}
      </span>
    </Button>
  );
};

export default React.memo(NetworkAddToWallet);
