import { Box, IconButton, MenuButton, MenuList, Skeleton, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ItemProps } from './types';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import Menu from 'ui/shared/chakra/Menu';
import IconSvg from 'ui/shared/IconSvg';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

import MetadataUpdateMenuItem from './items/MetadataUpdateMenuItem';
import PrivateTagMenuItem from './items/PrivateTagMenuItem';
import PublicTagMenuItem from './items/PublicTagMenuItem';
import TokenInfoMenuItem from './items/TokenInfoMenuItem';

interface Props {
  isLoading?: boolean;
  className?: string;
  showUpdateMetadataItem?: boolean;
}

const AccountActionsMenu = ({ isLoading, className, showUpdateMetadataItem }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const isTokenPage = router.pathname === '/token/[hash]';
  const isTokenInstancePage = router.pathname === '/token/[hash]/instance/[id]';
  const isTxPage = router.pathname === '/tx/[hash]';

  const profileQuery = useProfileQuery();

  const handleButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Address actions (more button)' });
  }, []);

  const userWithoutEmail = profileQuery.data && !profileQuery.data.email;

  const items = [
    {
      render: (props: ItemProps) => <MetadataUpdateMenuItem { ...props }/>,
      enabled: isTokenInstancePage && showUpdateMetadataItem,
    },
    {
      render: (props: ItemProps) => <TokenInfoMenuItem { ...props }/>,
      enabled: config.features.account.isEnabled && isTokenPage && config.features.addressVerification.isEnabled && !userWithoutEmail,
    },
    {
      render: (props: ItemProps) => <PrivateTagMenuItem { ...props } entityType={ isTxPage ? 'tx' : 'address' }/>,
      enabled: config.features.account.isEnabled,
    },
    {
      render: (props: ItemProps) => <PublicTagMenuItem { ...props }/>,
      enabled: config.features.account.isEnabled && !isTxPage && config.features.publicTagsSubmission.isEnabled,
    },
  ].filter(({ enabled }) => enabled);

  if (items.length === 0) {
    return null;
  }

  if (isLoading) {
    return <Skeleton w="36px" h="32px" borderRadius="base" className={ className }/>;
  }

  if (items.length === 1) {
    return (
      <Box className={ className }>
        { items[0].render({ type: 'button', hash }) }
      </Box>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={ IconButton }
        className={ className }
        size="sm"
        variant="outline"
        colorScheme="gray"
        px="7px"
        onClick={ handleButtonClick }
        icon={ <IconSvg name="dots" boxSize="18px"/> }
        aria-label="Show address menu"
      />
      <MenuList minWidth="180px" zIndex="popover">
        { items.map(({ render }, index) => (
          <React.Fragment key={ index }>
            { render({ type: 'menu_item', hash }) }
          </React.Fragment>
        )) }
      </MenuList>
    </Menu>
  );
};

export default React.memo(chakra(AccountActionsMenu));
