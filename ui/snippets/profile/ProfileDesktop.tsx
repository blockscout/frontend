import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import Popover from 'ui/shared/chakra/Popover';
import AuthModal from 'ui/snippets/auth/AuthModal';

import ProfileButton from './ProfileButton';
import ProfileMenuContent from './ProfileMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  isHomePage?: boolean;
}

const ProfileDesktop = ({ buttonSize, isHomePage }: Props) => {
  const profileQuery = useFetchProfileInfo();
  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  return (
    <>
      <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ profileMenu.isOpen } onClose={ profileMenu.onClose }>
        <PopoverTrigger>
          <ProfileButton
            profileQuery={ profileQuery }
            size={ buttonSize }
            variant={ isHomePage ? 'hero' : 'header' }
            onClick={ profileQuery.data ? profileMenu.onOpen : authModal.onOpen }
          />

        </PopoverTrigger>
        { profileQuery.data && (
          <PopoverContent maxW="280px" minW="220px" w="min-content">
            <PopoverBody>
              <ProfileMenuContent data={ profileQuery.data } onClose={ profileMenu.onClose }/>
            </PopoverBody>
          </PopoverContent>
        ) }
      </Popover>
      { authModal.isOpen && <AuthModal onClose={ authModal.onClose } initialScreen={{ type: 'select_method' }}/> }
    </>
  );
};

export default React.memo(ProfileDesktop);
