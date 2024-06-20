import { IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  onClick: () => void;
  label: string;
  icon: IconName | React.ReactElement;
  isDisabled?: boolean;
}

const ButtonItem = ({ className, label, onClick, icon, isDisabled }: Props) => {
  return (
    <Tooltip label={ label }>
      <IconButton
        aria-label={ label }
        className={ className }
        icon={ typeof icon === 'string' ? <IconSvg name={ icon } boxSize={ 6 }/> : icon }
        onClick={ onClick }
        isDisabled={ isDisabled }
        size="sm"
        variant="outline"
        px="4px"
      />
    </Tooltip>
  );
};

export default ButtonItem;
