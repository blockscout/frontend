import { Tooltip, useBoolean, useOutsideClick, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { SECOND } from 'lib/consts';
import removeQueryParam from 'lib/router/removeQueryParam';

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  isMobile?: boolean;
  isWalletConnected?: boolean;
  isAutoConnectDisabled?: boolean;
};

const LOCAL_STORAGE_KEY = 'wallet-connect-tooltip-shown';

const WalletTooltip = ({ children, isDisabled, isMobile, isWalletConnected, isAutoConnectDisabled }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const router = useRouter();
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);
  const innerRef = React.useRef(null);
  useOutsideClick({ ref: innerRef, handler: setIsTooltipShown.off });

  const label = React.useMemo(() => {
    if (isWalletConnected) {
      if (isAutoConnectDisabled) {
        return <span>Your wallet is not<br/>connected to this app.<br/>Connect your wallet<br/>in the app directly</span>;
      }
      return null;
    }
    return <span>Connect your wallet<br/>to Blockscout for<br/>full-featured access</span>;
  }, [ isWalletConnected, isAutoConnectDisabled ]);

  const isAppPage = router.pathname === '/apps/[id]';

  React.useEffect(() => {
    const wasShown = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const isMarketplacePage = router.pathname === '/apps';
    const isTooltipShowAction = router.query.action === 'tooltip';
    const isConnectWalletAction = router.query.action === 'connect';
    const needToShow = (isAppPage && !isConnectWalletAction) || isTooltipShowAction || (!wasShown && isMarketplacePage);
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;

    if (!isDisabled && needToShow) {
      timer1 = setTimeout(() => {
        setIsTooltipShown.on();
        timer2 = setTimeout(() => setIsTooltipShown.off(), 3 * SECOND);
        if (!wasShown && isMarketplacePage) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
        }
        if (isTooltipShowAction) {
          removeQueryParam(router, 'action');
        }
      }, isTooltipShowAction ? 0 : SECOND);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [ setIsTooltipShown, isDisabled, router, isAppPage ]);

  return (
    <Box ref={ ref }>
      <Tooltip
        label={ label }
        textAlign="center"
        padding={ 2 }
        isDisabled={ isDisabled || !label || (isWalletConnected && !isAppPage) }
        openDelay={ 500 }
        isOpen={ isTooltipShown || (isMobile ? false : undefined) }
        onClose={ setIsTooltipShown.off }
        display={ isMobile ? { base: 'flex', lg: 'none' } : { base: 'none', lg: 'flex' } }
        ref={ innerRef }
      >
        { children }
      </Tooltip>
    </Box>
  );
};

export default React.forwardRef(WalletTooltip);
