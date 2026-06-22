// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { LinkProps } from 'src/toolkit/chakra/link';
import { Link } from 'src/toolkit/chakra/link';

const FooterCookieSettings = (props: LinkProps) => {

  const handleClick = React.useCallback(() => {
    window.__ucCmp?.showSecondLayer();
  }, []);

  return (
    <Link
      variant="secondary"
      textStyle="xs"
      columnGap={ 1 }
      mt={ 3 }
      onClick={ handleClick }
      { ...props }
    >
      <SpriteIcon name="cookie" boxSize={ 4 }/>
      <span>Cookie settings</span>
    </Link>
  );
};

export default React.memo(FooterCookieSettings);
