import React from 'react';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  url: string;
}

const SupportLink = ({ url }: Props) => {
  const isEmail = url.includes('@');
  const href = isEmail ? `mailto:${ url }` : url;

  return (
    <Link
      href={ href }
      target="_blank"
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <IconSvg name={ isEmail ? 'email' : 'link' } boxSize={ 6 } color="text.secondary"/>
      <span>{ url }</span>
    </Link>
  );
};

export default SupportLink;
