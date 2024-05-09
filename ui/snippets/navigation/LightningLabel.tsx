import { useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import IconSvg from 'ui/shared/IconSvg';

const LightningLabel = ({ bgColor, isCollapsed }: { bgColor?: string; isCollapsed?: boolean }) => {
  const themeBgColor = useColorModeValue('white', 'black');
  const defaultTransitionProps = getDefaultTransitionProps({ transitionProperty: 'color' });

  const color = React.useMemo(() => {
    if (isCollapsed) {
      return (bgColor && bgColor !== 'transparent') ? bgColor : themeBgColor;
    }
    return 'transparent';
  }, [ bgColor, themeBgColor, isCollapsed ]);

  return (
    <IconSvg
      className="lightning-label"
      name="lightning_sidebar"
      boxSize={ 4 }
      ml={ isCollapsed ? 0 : 1 }
      position={ isCollapsed ? 'absolute' : 'relative' }
      top={ isCollapsed ? '10px' : '0' }
      right={ isCollapsed ? '15px' : '0' }
      color={ color }
      { ...defaultTransitionProps }
    />
  );
};

export default LightningLabel;
