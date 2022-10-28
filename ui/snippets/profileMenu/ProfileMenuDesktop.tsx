import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import link from 'lib/link/link';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuDesktop = () => {
  const { data } = useFetchProfileInfo();
  const loginUrl = link('auth');

  return (
    <Popover openDelay={ 300 } placement="bottom-end" gutter={ 10 } isLazy>
      <PopoverTrigger>
        <Button
          variant="unstyled"
          display="inline-flex"
          height="auto"
          flexShrink={ 0 }
          as={ data ? undefined : 'a' }
          href={ data ? undefined : loginUrl }
        >
          <UserAvatar size={ 50 } data={ data }/>
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
