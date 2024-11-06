import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const TOP_BAR_HEIGHT = 36;
const HORIZONTAL_NAV_BAR_HEIGHT = config.UI.navigation.layout === 'horizontal' ? 49 : 0;

const MainArea = ({ children, className }: Props) => {
  return (
    <Flex
      className={ className }
      w="100%"
      m="0 auto"
      minH={{
        base: `calc(100vh - ${ TOP_BAR_HEIGHT }px)`,
        lg: `calc(100vh - ${ TOP_BAR_HEIGHT + HORIZONTAL_NAV_BAR_HEIGHT }px)`,
      }}
      alignItems="stretch"
      flexDirection="column"
    >
      { children }
    </Flex>
  );
};

export default React.memo(chakra(MainArea));
