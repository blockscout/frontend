import { useRouter } from 'next/router';
import React from 'react';

import type { ItemProps } from '../types';

import IconSvg from 'ui/shared/IconSvg';

import ButtonItem from '../parts/ButtonItem';
import MenuItem from '../parts/MenuItem';

const PublicTagMenuItem = ({ className, hash, type }: ItemProps) => {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    router.push({ pathname: '/public-tags/submit', query: { addresses: [ hash ] } });
  }, [ hash, router ]);

  switch (type) {
    case 'button': {
      return <ButtonItem label="Add public tag" icon="publictags" onClick={ handleClick } className={ className }/>;
    }
    case 'menu_item': {
      return (
        <MenuItem className={ className } onClick={ handleClick }>
          <IconSvg name="publictags" boxSize={ 6 } mr={ 2 }/>
          <span>Add public tag</span>
        </MenuItem>
      );
    }
  }
};

export default React.memo(PublicTagMenuItem);
