import { Popover, PopoverTrigger, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import * as cookies from 'lib/cookies';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuPopup from './NetworkMenuPopup';
interface Props {
  isCollapsed: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  const router = useRouter();
  const networkType = router.query.network_type;
  const networkSubType = router.query.network_sub_type;

  React.useEffect(() => {
    if (typeof networkType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_TYPE, networkType);
    }
    if (typeof networkSubType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_SUB_TYPE, networkSubType);
    }
  }, [ networkType, networkSubType ]);

  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 22 } isLazy>
      <PopoverTrigger>
        <Box>
          <NetworkMenuButton isCollapsed={ isCollapsed }/>
        </Box>
      </PopoverTrigger>
      <NetworkMenuPopup/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
