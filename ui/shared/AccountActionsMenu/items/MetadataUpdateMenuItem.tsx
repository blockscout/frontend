import React from 'react';

import type { ItemProps } from '../types';

import IconSvg from 'ui/shared/IconSvg';
import { useMetadataUpdateContext } from 'ui/tokenInstance/contexts/metadataUpdate';

import ButtonItem from '../parts/ButtonItem';
import MenuItem from '../parts/MenuItem';

const MetadataUpdateMenuItem = ({ type }: ItemProps) => {

  const { status, setStatus } = useMetadataUpdateContext() || {};

  const handleClick = React.useCallback(() => {
    setStatus?.('MODAL_OPENED');
  }, [ setStatus ]);

  const element = (() => {
    switch (type) {
      case 'button': {
        return (
          <ButtonItem
            label="Refresh metadata"
            icon="refresh"
            onClick={ handleClick }
            isDisabled={ status === 'WAITING_FOR_RESPONSE' }
          />
        );
      }
      case 'menu_item': {
        return (
          <MenuItem onClick={ handleClick } isDisabled={ status === 'WAITING_FOR_RESPONSE' } value="refresh-metadata">
            <IconSvg name="refresh" boxSize={ 5 }/>
            <span>Refresh metadata</span>
          </MenuItem>
        );
      }
    }
  })();

  return element;
};

export default React.memo(MetadataUpdateMenuItem);
