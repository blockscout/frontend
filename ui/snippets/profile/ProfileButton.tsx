import type { ButtonProps } from '@chakra-ui/react';
import { Button, Skeleton, Tooltip, Text, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import UserAvatar from 'ui/shared/UserAvatar';

import { getUserHandle } from './utils';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: 'hero' | 'header';
  onClick: () => void;
}

const ProfileButton = ({ profileQuery, size, variant, onClick }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [ isFetched, setIsFetched ] = React.useState(false);
  const { data, isLoading } = profileQuery;

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const content = (() => {
    if (!data) {
      return 'Connect';
    }

    if (data.email) {
      return (
        <HStack gap={ 2 }>
          <UserAvatar size={ 20 }/>
          <Text>{ getUserHandle(data.email) }</Text>
        </HStack>
      );
    }

    return 'Connected';
  })();

  return (
    <Tooltip
      label={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isFetched || Boolean(data) }
      openDelay={ 500 }
    >
      <Skeleton isLoaded={ isFetched } borderRadius="base" ref={ ref }>
        <Button
          size={ size }
          variant={ variant }
          onClick={ onClick }
          data-selected={ Boolean(data) }
        >
          { content }
        </Button>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(ProfileButton));
