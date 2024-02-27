import { Link } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  url?: string | undefined;
}

const WebsiteLink = ({ url }: Props) => {
  if (!url) {
    return null;
  }

  function getHostname(url: string) {
    try {
      return new URL(url).hostname;
    } catch (err) {}
  }

  return (
    <Link
      href={ url }
      target="_blank"
      display="inline-flex"
      alignItems="center"
      columnGap={ 1 }
      mt={ 3 }
    >
      <IconSvg name="link" boxSize={ 5 } color="text_secondary"/>
      <span>{ getHostname(url) }</span>
    </Link>
  );
};

export default WebsiteLink;
