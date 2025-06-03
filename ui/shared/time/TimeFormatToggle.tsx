import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import { IconButton } from 'toolkit/chakra/icon-button';
import type { IconButtonProps } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends IconButtonProps {}

const TimeFormatToggle = (props: Props) => {
  const settings = useSettingsContext();
  const timeFormat = settings?.timeFormat || 'relative';

  return (
    <Tooltip content="Toggle time format">
      <IconButton
        aria-label="Toggle time format"
        variant="icon_secondary"
        onClick={ settings?.toggleTimeFormat }
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
