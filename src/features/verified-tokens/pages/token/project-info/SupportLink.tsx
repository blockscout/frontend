// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

interface Props {
  url: string;
}

const SupportLink = ({ url }: Props) => {
  const isEmail = url.includes('@');
  const href = isEmail ? `mailto:${ url }` : url;

  return (
    <Link
      href={ href }
      external
      noIcon
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <SpriteIcon name={ isEmail ? 'email' : 'link' } boxSize={ 6 } color="icon.primary"/>
      <span>{ url }</span>
    </Link>
  );
};

export default SupportLink;
