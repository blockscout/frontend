import type { IconButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, IconButton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import * as mixpanel from 'lib/mixpanel/index';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

type Props = {
  isHomePage?: boolean;
};

const ProfileMenuDesktop = ({ isHomePage }: Props) => {
  const { data, error, isLoading } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
  const [ hasMenu, setHasMenu ] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      setHasMenu(Boolean(data));
    }
  }, [ data, error?.status, isLoading ]);

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
    if (data?.avatar) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ data?.avatar, isHomePage ]);

  let iconButtonStyles: Partial<IconButtonProps> = {};
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBorderColor = useColorModeValue('gray.300', 'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');
  if (data?.avatar) {
    iconButtonStyles = {
      bg: isHomePage ? '#EBF8FF' : themedBackground,
    };
  } else if (isHomePage) {
    iconButtonStyles = {
      color: '#fff',
    };
  } else {
    iconButtonStyles = {
      borderColor: themedBorderColor,
      color: themedColor,
    };
  }

  return (
    <Popover openDelay={ 300 } placement="bottom-end" gutter={ 10 } isLazy>
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
