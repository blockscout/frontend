// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { makePrettyLink } from 'src/toolkit/utils/url';

interface Props {
  url?: string | undefined;
}

const WebsiteLink = ({ url }: Props) => {
  if (!url) {
    return null;
  }

  return (
    <Link
      external
      noIcon
      href={ url }
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
      mt={ 3 }
    >
      <SpriteIcon name="link" boxSize={ 5 } color="icon.primary"/>
      <span>{ makePrettyLink(url)?.domain }</span>
    </Link>
  );
};

export default WebsiteLink;
