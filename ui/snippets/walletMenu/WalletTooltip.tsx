import { Tooltip, useBoolean, useOutsideClick } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { SECOND } from 'lib/consts';
import removeQueryParam from 'lib/router/removeQueryParam';

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  isMobile?: boolean;
};

const WalletTooltip = ({ children, isDisabled, isMobile }: Props) => {
  const router = useRouter();
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);
  const ref = React.useRef(null);
  useOutsideClick({ ref, handler: setIsTooltipShown.off });

  const { defaultLabel, label, localStorageKey } = React.useMemo(() => {
    const isAppPage = router.pathname === '/apps/[id]';
    const defaultLabel = <span>Your wallet is used to interact with<br/>apps and contracts in the explorer</span>;
    const label = isAppPage ?
      <span>Connect once to use your wallet with<br/>all apps in the DAppscout marketplace!</span> :
      defaultLabel;
    const localStorageKey = `${ isAppPage ? 'dapp-' : '' }wallet-connect-tooltip-shown`;
    return { defaultLabel, label, localStorageKey };
  }, [ router.pathname ]);

  React.useEffect(() => {
    const wasShown = window.localStorage.getItem(localStorageKey);
    const isMarketplacePage = [ '/apps', '/apps/[id]' ].includes(router.pathname);
    const isTooltipShowAction = router.query.action === 'tooltip';
    const isConnectWalletAction = router.query.action === 'connect';
    const needToShow = (!wasShown && !isConnectWalletAction) || isTooltipShowAction;
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;

    if (!isDisabled && isMarketplacePage && needToShow) {
      timer1 = setTimeout(() => {
        setIsTooltipShown.on();
        window.localStorage.setItem(localStorageKey, 'true');
        timer2 = setTimeout(() => setIsTooltipShown.off(), 5 * SECOND);
        if (isTooltipShowAction) {
          removeQueryParam(router, 'action');
        }
      }, isTooltipShowAction ? 0 : SECOND);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [ setIsTooltipShown, localStorageKey, isDisabled, router ]);

  return (
    <Tooltip
      label={ isTooltipShown ? label : defaultLabel }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isDisabled }
      openDelay={ 500 }
      isOpen={ isTooltipShown || (isMobile ? false : undefined) }
      onClose={ setIsTooltipShown.off }
      display={ isMobile ? { base: 'flex', lg: 'none' } : { base: 'none', lg: 'flex' } }
      ref={ ref }
    >
      { children }
    </Tooltip>
  );
};

export default WalletTooltip;
