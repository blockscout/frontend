import { Link } from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

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
      target="_blank"
      display="inline-flex"
      alignItems="center"
    >
      <IconSvg name={ icon } boxSize={ 5 } mr={ 2 } color="text_secondary"/>
      <span>{ title }</span>
    </Link>
  );
};

export default ServiceLink;
