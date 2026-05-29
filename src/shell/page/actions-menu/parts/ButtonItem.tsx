// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  className?: string;
  onClick: () => void;
  label: string;
  icon: IconName | React.ReactElement;
  isDisabled?: boolean;
}

const ButtonItem = ({ className, label, onClick, icon, isDisabled }: Props) => {
  return (
    <Tooltip content={ label } disabled={ isDisabled } disableOnMobile>
      <IconButton
        aria-label={ label }
        className={ className }
        onClick={ onClick }
        disabled={ isDisabled }
        variant="icon_background"
        boxSize={ 8 }
      >
        { typeof icon === 'string' ? <SpriteIcon name={ icon } boxSize={ 6 }/> : icon }
      </IconButton>
    </Tooltip>
  );
};

export default ButtonItem;
