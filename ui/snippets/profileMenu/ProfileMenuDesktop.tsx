import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import * as mixpanel from 'lib/mixpanel/index';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuDesktop = () => {
  const { data, error, isPending } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
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

  const buttonProps: Partial<ButtonProps> = (() => {
    if (hasMenu || !loginUrl) {
      return {};
    }

    return {
      as: 'a',
      href: loginUrl,
      onClick: handleSignInClick,
    };
  })();

  return (
    <Popover openDelay={ 300 } placement="bottom-end" gutter={ 10 } isLazy>
      <PopoverTrigger>
        <Button
          variant="unstyled"
          display="block"
          boxSize="50px"
          flexShrink={ 0 }
          { ...buttonProps }
        >
          <UserAvatar size={ 50 }/>
        </Button>
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
