import { useRouter } from 'next/router';
import React from 'react';

import type { ItemProps } from '../types';

import { MenuItem } from 'toolkit/chakra/menu';
import IconSvg from 'ui/shared/IconSvg';

import ButtonItem from '../parts/ButtonItem';

const PublicTagMenuItem = ({ hash, type }: ItemProps) => {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    router.push({ pathname: '/public-tags/submit', query: { addresses: [ hash ] } });
  }, [ hash, router ]);

  switch (type) {
    case 'button': {
      return <ButtonItem label="Add public tag" icon="publictags" onClick={ handleClick }/>;
    }
    case 'menu_item': {
      return (
        <MenuItem onClick={ handleClick } value="add-public-tag">
          <IconSvg name="publictags" boxSize={ 6 }/>
          <span>Add public tag</span>
        </MenuItem>
      );
    }
  }
};

export default React.memo(PublicTagMenuItem);
