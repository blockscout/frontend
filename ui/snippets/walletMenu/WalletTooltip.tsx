import { Tooltip, useBoolean, useOutsideClick } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  isMobile?: boolean;
};

const WalletTooltip = ({ children, isDisabled, isMobile }: Props) => {
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);
  const ref = React.useRef(null);
  useOutsideClick({ ref, handler: setIsTooltipShown.off });

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
      openDelay={ 300 }
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
