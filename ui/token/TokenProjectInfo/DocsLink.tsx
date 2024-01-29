import { Link } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  href: string;
}

const DocsLink = ({ href }: Props) => {
  return (
    <Link
      href={ href }
      target="_blank"
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
    >
      <IconSvg name="docs" boxSize={ 6 } color="text_secondary"/>
      <span>Documentation</span>
    </Link>
  );
};

export default DocsLink;
