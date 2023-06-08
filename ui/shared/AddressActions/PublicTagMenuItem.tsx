import { MenuItem, Icon, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import React from 'react';

import iconPublicTags from 'icons/publictags.svg';

interface Props {
  className?: string;
  hash: string;
  onBeforeClick: (route: Route) => boolean;
}

const PublicTagMenuItem = ({ className, hash, onBeforeClick }: Props) => {
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    if (!onBeforeClick({ pathname: '/account/public_tags_request' })) {
      return;
    }

    router.push({ pathname: '/account/public_tags_request', query: { address: hash } });
  }, [ hash, onBeforeClick, router ]);

  return (
    <MenuItem className={ className }onClick={ handleClick }>
      <Icon as={ iconPublicTags } boxSize={ 6 } mr={ 2 }/>
      <span>Add public tag</span>
    </MenuItem>
  );
};

export default React.memo(chakra(PublicTagMenuItem));
