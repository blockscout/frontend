import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuDesktop = () => {
  const { data, error } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();

  const buttonProps: Partial<ButtonProps> = (() => {
    if (error?.status === 403) {
      return {
        as: 'a',
        href: route({ pathname: '/auth/profile' }),
      };
    }

    if (!data) {
      return {
        as: 'a',
        href: loginUrl,
      };
    }

    return {};
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
      { data && (
        <PopoverContent w="212px">
          <PopoverBody padding="24px 16px 16px 16px">
            <ProfileMenuContent { ...data }/>
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

export default ProfileMenuDesktop;
