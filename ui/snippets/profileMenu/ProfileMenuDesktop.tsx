import type { IconButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, IconButton, Tooltip, Box } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import * as mixpanel from 'lib/mixpanel/index';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';

type Props = {
  isHomePage?: boolean;
};

const ProfileMenuDesktop = ({ isHomePage }: Props) => {
  const { data, error, isPending } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
  const { themedBackground, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ hasMenu, setHasMenu ] = React.useState(false);

  React.useEffect(() => {
    if (!isPending) {
      setHasMenu(Boolean(data));
    }
  }, [ data, error?.status, isPending ]);

  const handleSignInClick = React.useCallback(() => {
    mixpanel.logEvent(
      mixpanel.EventTypes.ACCOUNT_ACCESS,
      { Action: 'Auth0 init' },
      { send_immediately: true },
    );
  }, []);

  const iconButtonProps: Partial<IconButtonProps> = (() => {
    if (hasMenu || !loginUrl) {
      return {};
    }

    return {
      as: 'a',
      href: loginUrl,
      onClick: handleSignInClick,
    };
  })();

  const variant = React.useMemo(() => {
    if (hasMenu) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ hasMenu, isHomePage ]);

  let iconButtonStyles: Partial<IconButtonProps> = {};
  if (hasMenu) {
    iconButtonStyles = {
      bg: isHomePage ? 'blue.50' : themedBackground,
    };
  } else if (isHomePage) {
    iconButtonStyles = {
      color: 'white',
    };
  } else {
    iconButtonStyles = {
      borderColor: themedBorderColor,
      color: themedColor,
    };
  }

  return (
    <Popover openDelay={ 300 } placement="bottom-end" gutter={ 10 } isLazy>
      <Tooltip
        label={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
        textAlign="center"
        padding={ 2 }
        isDisabled={ hasMenu }
        openDelay={ 500 }
      >
        <Box>
          <PopoverTrigger>
            <IconButton
              aria-label="profile menu"
              icon={ <UserAvatar size={ 20 }/> }
              variant={ variant }
              colorScheme="blue"
              boxSize="40px"
              flexShrink={ 0 }
              { ...iconButtonProps }
              { ...iconButtonStyles }
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>
      { hasMenu && (
        <PopoverContent w="212px">
          <PopoverBody padding="24px 16px 16px 16px">
            <ProfileMenuContent data={ data }/>
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

export default ProfileMenuDesktop;
