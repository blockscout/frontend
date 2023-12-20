import { Tooltip, useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  isMobile?: boolean;
};

const WalletTooltip = ({ children, isDisabled, isMobile }: Props) => {
  const router = useRouter();
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);

  const { defaultLabel, label, localStorageKey } = React.useMemo(() => {
    const isAppPage = router.pathname === '/apps/[id]';
    const defaultLabel = <span>Your wallet is used to interact with<br/>apps and contracts in the explorer</span>;
    const label = isAppPage ?
      <span>Connect once to use your wallet with<br/>all apps in the DAppscout marketplace!</span> :
      defaultLabel;
    const localStorageKey = `${ isAppPage ? 'dapp-' : '' }wallet-connect-tooltip-shown-${ isMobile ? 'mobile' : 'desktop' }`;
    return { defaultLabel, label, localStorageKey };
  }, [ router.pathname, isMobile ]);

  React.useEffect(() => {
    const wasShown = window.localStorage.getItem(localStorageKey);
    if (!wasShown) {
      setIsTooltipShown.on();
      window.localStorage.setItem(localStorageKey, 'true');
      setTimeout(() => setIsTooltipShown.off(), 3000);
    }
  }, [ setIsTooltipShown, localStorageKey ]);

  return (
    <Tooltip
      label={ isTooltipShown ? label : defaultLabel }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isDisabled }
      openDelay={ 300 }
      isOpen={ isTooltipShown || (isMobile ? false : undefined) }
      onClose={ setIsTooltipShown.off }
      display={ isMobile ? { base: 'flex', lg: 'none' } : { base: 'none', lg: 'flex' } }
    >
      { children }
    </Tooltip>
  );
};

export default WalletTooltip;
