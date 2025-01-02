import { Link } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppSocialInfo } from 'types/client/marketplace';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

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
      target="_blank"
      display="inline-flex"
      alignItems="center"
    >
      <IconSvg name={ icon } boxSize={ 5 } mr={ 2 } color="text_secondary"/>
      <span>{ title }</span>
    </Link>
  );
};

export default SocialLink;
