// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MarketplaceAppSocialInfo } from 'client/features/marketplace/types/client';

import type { IconName } from 'client/sprite/SpriteIcon';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { Link } from 'toolkit/chakra/link';

export interface Props {
  field: keyof MarketplaceAppSocialInfo;
  icon: IconName;
  title: string;
  href?: string;
}

const SocialLink = ({ href, icon, title }: Props) => {
  return (
    <Link
      href={ href }
      aria-label={ title }
      title={ title }
      external noIcon
      display="inline-flex"
      alignItems="center"
    >
      <SpriteIcon name={ icon } boxSize={ 5 } mr={ 2 } color="icon.primary"/>
      <span>{ title }</span>
    </Link>
  );
};

export default SocialLink;
