import { MenuItem, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useRedirectIfNotAuth from 'lib/hooks/useRedirectIfNotAuth';

interface Props {
  className?: string;
  hash: string;
}

const PublicTagMenuItem = ({ className, hash }: Props) => {
  const router = useRouter();
  const redirectIfNotAuth = useRedirectIfNotAuth();

  const handleClick = React.useCallback(() => {
    if (redirectIfNotAuth()) {
      return;
    }

    router.push({ pathname: '/account/public_tags_request', query: { address: hash } });
  }, [ hash, redirectIfNotAuth, router ]);

  return (
    <MenuItem className={ className }onClick={ handleClick }>
      Add public tag
    </MenuItem>
  );
};

export default React.memo(chakra(PublicTagMenuItem));
