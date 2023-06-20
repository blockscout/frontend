import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuDesktop = () => {
  const { data, error, isLoading } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
  const [ hasMenu, setHasMenu ] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      setHasMenu(Boolean(data) || error?.status === 403);
    }
  }, [ data, error?.status, isLoading ]);

  const buttonProps: Partial<ButtonProps> = (() => {
    if (hasMenu) {
      return {};
    }

    return {
      as: 'a',
      href: loginUrl,
    };
  })();

  return (
    <Popover openDelay={ 300 } placement="bottom-end" gutter={ 10 } isLazy>
      <PopoverTrigger>
        <Button
          variant="unstyled"
          display="inline-flex"
          height="auto"
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
