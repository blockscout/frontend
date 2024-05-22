import { useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import IconSvg from 'ui/shared/IconSvg';

export const LIGHTNING_LABEL_CLASS_NAME = 'lightning-label';

const LightningLabel = ({ bgColor, isCollapsed }: { bgColor?: string; isCollapsed?: boolean }) => {
  const isLgScreen = useBreakpointValue({ base: false, lg: true, xl: false });
  const themeBgColor = useColorModeValue('white', 'black');
  const defaultTransitionProps = getDefaultTransitionProps({ transitionProperty: 'color' });

  const isExpanded = isCollapsed === false;

  const color = React.useMemo(() => {
    if (isCollapsed || (!isExpanded && isLgScreen)) {
      return (bgColor && bgColor !== 'transparent') ? bgColor : themeBgColor;
    }
    return 'transparent';
  }, [ bgColor, themeBgColor, isCollapsed, isExpanded, isLgScreen ]);

  return (
    <IconSvg
      className={ LIGHTNING_LABEL_CLASS_NAME }
      name="lightning_navbar"
      boxSize={ 4 }
      ml={{ base: 1, lg: isExpanded ? 1 : 0, xl: isCollapsed ? 0 : 1 }}
      position={{ lg: isExpanded ? 'relative' : 'absolute', xl: isCollapsed ? 'absolute' : 'relative' }}
      top={{ lg: isExpanded ? '0' : '10px', xl: isCollapsed ? '10px' : '0' }}
      right={{ lg: isExpanded ? '0' : '15px', xl: isCollapsed ? '15px' : '0' }}
      color={ color }
      { ...defaultTransitionProps }
    />
  );
};

export default LightningLabel;
