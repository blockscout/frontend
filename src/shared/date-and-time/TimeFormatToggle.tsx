// SPDX-License-Identifier: LicenseRef-Blockscout

import type { StackProps } from '@chakra-ui/react';
import { chakra, HStack } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'src/shell/top-bar/settings/context';

import * as mixpanel from 'src/services/mixpanel';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props extends StackProps {}

const TimeFormatToggle = (props: Props) => {
  const settings = useSettingsContext();
  const timeFormat = settings?.timeFormat || 'relative';

  const handleClick = React.useCallback(() => {
    settings?.toggleTimeFormat();
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Switch time format', Source: 'Table header' });
  }, [ settings ]);

  const text = (() => {
    if (timeFormat === 'relative') {
      return null;
    }

    return <chakra.span color="icon.secondary">{ settings?.isLocalTime ? 'Local' : 'UTC' }</chakra.span>;
  })();

  return (
    <HStack display="inline-flex" gap={ 1 } ml={ 2 } verticalAlign="bottom" { ...props }>
      <Tooltip content="Toggle time format">
        <IconButton
          aria-label="Toggle time format"
          variant="icon_secondary"
          onClick={ handleClick }
          boxSize={ 5 }
          selected={ timeFormat === 'absolute' }
          borderRadius="sm"
          verticalAlign="bottom"
        >
          <SpriteIcon name="clock-light" boxSize="14px"/>
        </IconButton>
      </Tooltip>
      { text }
    </HStack>
  );
};

export default React.memo(TimeFormatToggle);
