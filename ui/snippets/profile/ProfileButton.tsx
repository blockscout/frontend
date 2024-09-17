import type { ButtonProps } from '@chakra-ui/react';
import { Button, Tooltip } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: 'hero' | 'header';
  onClick: () => void;
}

const ProfileButton = ({ profileQuery, size, variant, onClick }: Props) => {
  const { data, isPending } = profileQuery;

  return (
    <Tooltip
      label={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isPending || Boolean(data) }
      openDelay={ 500 }
    >
      <Button size={ size } variant={ variant } onClick={ onClick }>Connect</Button>
    </Tooltip>
  );
};

export default React.memo(ProfileButton);
