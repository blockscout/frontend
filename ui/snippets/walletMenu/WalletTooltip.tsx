import { Tooltip, useBoolean } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  isMobile?: boolean;
};

const WalletTooltip = ({ children, isDisabled, isMobile }: Props) => {
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);

  React.useEffect(() => {
    const key = `wallet-connect-tooltip-shown-${ isMobile ? 'mobile' : 'desktop' }`;
    const wasShown = window.localStorage.getItem(key);
    if (!wasShown) {
      setIsTooltipShown.on();
      window.localStorage.setItem(key, 'true');
    }
  }, [ setIsTooltipShown, isMobile ]);

  return (
    <Tooltip
      label={ <span>Your wallet is used to interact with<br/>apps and contracts in the explorer</span> }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isDisabled }
      openDelay={ 500 }
      isOpen={ isTooltipShown || (isMobile ? false : undefined) }
      onClose={ setIsTooltipShown.off }
      display={ isMobile ? { base: 'flex', lg: 'none' } : { base: 'none', lg: 'flex' } }
    >
      { children }
    </Tooltip>
  );
};

export default WalletTooltip;
