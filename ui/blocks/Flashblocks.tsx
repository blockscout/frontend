import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import { Switch } from 'toolkit/chakra/switch';
import { Hint } from 'toolkit/components/Hint/Hint';

import FlashblocksList from './flashblocks/FlashblocksList';
import FlashblocksStats from './flashblocks/FlashblocksStats';
import FlashblocksTable from './flashblocks/FlashblocksTable';
import useFlashblocksSocketData from './flashblocks/useFlashblocksSocketData';

const Flashblocks = () => {

  const manualModeRef = React.useRef(false);
  const [ isRealTime, setIsRealTime ] = React.useState(true);
  const { items, itemsNum, newItemsNum, txsNum, pause, resume, initialTs, status } = useFlashblocksSocketData();

  const handleFormatChange = React.useCallback(({ checked }: { checked: boolean }) => {
    if (checked) {
      resume();
    } else {
      pause();
    }
    setIsRealTime(checked);
    manualModeRef.current = !checked;
  }, [ pause, resume ]);

  const handleAlertLinkClick = React.useCallback(() => {
    handleFormatChange({ checked: true });
  }, [ handleFormatChange ]);

  const handleMouseEnter = React.useCallback(() => {
    if (isRealTime && status === 'connected' && !manualModeRef.current) {
      pause();
      setIsRealTime(false);
    }
  }, [ isRealTime, pause, status ]);

  const handleMouseLeave = React.useCallback(() => {
    if (!isRealTime && status === 'connected' && !manualModeRef.current) {
      resume();
      setIsRealTime(true);
    }
  }, [ isRealTime, resume, status ]);

  const showAlertError = status === 'error' || status === 'disconnected';

  return (
    <Box>
      <FlashblocksStats itemsNum={ itemsNum } txsNum={ txsNum } initialTs={ initialTs }/>
      <HStack gap={ 2 } mb={ 4 }>
        <Switch size="md" flexDirection="row-reverse" onCheckedChange={ handleFormatChange } checked={ isRealTime }>
          Real-time feed
        </Switch>
        <Hint label="Real-time flashblocks show the latest flashblocks with real-time updates in the chronological order. "/>
      </HStack>
      <Box hideBelow="lg" onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave }>
        <FlashblocksTable
          items={ items }
          newItemsNum={ newItemsNum }
          onAlertLinkClick={ handleAlertLinkClick }
          showAlertError={ showAlertError }
        />
      </Box>
      <Box hideFrom="lg">
        <FlashblocksList
          data={ items }
          newItemsNum={ newItemsNum }
          onAlertLinkClick={ handleAlertLinkClick }
          showAlertError={ showAlertError }
        />
      </Box>
    </Box>
  );
};

export default React.memo(Flashblocks);
