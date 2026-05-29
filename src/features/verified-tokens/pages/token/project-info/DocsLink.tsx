// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

interface Props {
  href: string;
}

const DocsLink = ({ href }: Props) => {
  return (
    <Link
      href={ href }
      external
      noIcon
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <SpriteIcon name="docs" boxSize={ 5 } color="icon.primary"/>
      <span>Documentation</span>
    </Link>
  );
};

export default DocsLink;
