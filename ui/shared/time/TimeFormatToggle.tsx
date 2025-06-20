import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import * as mixpanel from 'lib/mixpanel/index';
import { IconButton } from 'toolkit/chakra/icon-button';
import type { IconButtonProps } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends IconButtonProps {}

const TimeFormatToggle = (props: Props) => {
  const settings = useSettingsContext();
  const timeFormat = settings?.timeFormat || 'relative';

  const handleClick = React.useCallback(() => {
    settings?.toggleTimeFormat();
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Switch time format', Source: 'Table header' });
  }, [ settings ]);

  return (
    <Tooltip content="Toggle time format">
      <IconButton
        aria-label="Toggle time format"
        variant="icon_secondary"
        onClick={ handleClick }
        boxSize={ 5 }
        selected={ timeFormat === 'absolute' }
        borderRadius="sm"
        ml={ 2 }
        verticalAlign="bottom"
        { ...props }
      >
        <IconSvg name="clock-light" boxSize="14px"/>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(TimeFormatToggle);
