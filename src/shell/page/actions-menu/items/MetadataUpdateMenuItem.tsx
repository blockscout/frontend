// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ItemProps } from '../types';

import { useMetadataUpdateContext } from 'src/slices/token/pages/instance/metadata-update-context';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { MenuItem } from 'src/toolkit/chakra/menu';

import ButtonItem from '../parts/ButtonItem';

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
          <MenuItem onClick={ handleClick } disabled={ status === 'WAITING_FOR_RESPONSE' } value="refresh-metadata">
            <SpriteIcon name="refresh" boxSize={ 5 }/>
            <span>Refresh metadata</span>
          </MenuItem>
        );
      }
    }
  })();

  return element;
};

export default React.memo(MetadataUpdateMenuItem);
