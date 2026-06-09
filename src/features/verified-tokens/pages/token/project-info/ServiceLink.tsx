// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenVerifiedInfo } from 'src/features/verified-tokens/types/api';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

export interface Props {
  field: keyof TokenVerifiedInfo;
  icon: IconName;
  title: string;
  href?: string;
}

const ServiceLink = ({ href, title, icon }: Props) => {
  return (
    <Link
      href={ href }
      aria-label={ title }
      title={ title }
      external
      noIcon
      display="inline-flex"
      alignItems="center"
    >
      <SpriteIcon name={ icon } boxSize={ 5 } mr={ 2 } color="icon.primary"/>
      <span>{ title }</span>
    </Link>
  );
};

export default ServiceLink;
