import { Icon, Link } from '@chakra-ui/react';
import React from 'react';

import iconEmail from 'icons/email.svg';
import iconLink from 'icons/link.svg';

interface Props {
  url: string;
}

const SupportLink = ({ url }: Props) => {
  const isEmail = url.includes('@');
  const href = isEmail ? `mailto:${ url }` : url;
  const icon = isEmail ? iconEmail : iconLink;

  return (
    <Link
      href={ href }
      target="_blank"
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <Icon as={ icon } boxSize={ 6 } color="text_secondary"/>
      <span>{ url }</span>
    </Link>
  );
};

export default SupportLink;
