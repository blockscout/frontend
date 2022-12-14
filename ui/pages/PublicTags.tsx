import { Link, Text, Icon } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { animateScroll } from 'react-scroll';

import type { PublicTag } from 'types/api/account';

import eastArrowIcon from 'icons/arrows/east.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import useToast from 'lib/hooks/useToast';
import PublicTagsData from 'ui/publicTags/PublicTagsData';
import PublicTagsForm from 'ui/publicTags/PublicTagsForm/PublicTagsForm';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

type TScreen = 'data' | 'form';

type TToastAction = 'added' | 'removed';

const toastDescriptions = {
  added: 'Your request sent to moderator. Waiting for...',
  removed: 'Tags have been removed.',
} as Record<TToastAction, string>;

const PublicTagsComponent: React.FC = () => {
  const [ screen, setScreen ] = useState<TScreen>('data');
  const [ formData, setFormData ] = useState<PublicTag>();

  const toast = useToast();
  const isMobile = useIsMobile();
  useRedirectForInvalidAuthToken();

  const showToast = useCallback((action: TToastAction) => {
    toast({
      position: 'top-right',
      title: 'Success',
      description: toastDescriptions[action],
      colorScheme: 'green',
      status: 'success',
      variant: 'subtle',
      isClosable: true,
      icon: null,
    });
  }, [ toast ]);

  const changeToFormScreen = useCallback((data?: PublicTag) => {
    setFormData(data);
    setScreen('form');
    animateScroll.scrollToTop({
      duration: 500,
      delay: 100,
    });
  }, []);

  const changeToDataScreen = useCallback((success?: boolean) => {
    if (success) {
      showToast('added');
    }
    setScreen('data');
    animateScroll.scrollToTop({
      duration: 500,
      delay: 100,
    });
  }, [ showToast ]);

  const onTagDelete = useCallback(() => showToast('removed'), [ showToast ]);
  const onGoBack = useCallback(() => setScreen('data'), [ ]);

  let content;
  let header;

  if (screen === 'data') {
    content = <PublicTagsData changeToFormScreen={ changeToFormScreen } onTagDelete={ onTagDelete }/>;
    header = 'Public tags';
  } else {
    content = <PublicTagsForm changeToDataScreen={ changeToDataScreen } data={ formData }/>;
    header = formData ? 'Request to edit a public tag/label' : 'Request a public tag/label';
  }

  return (
    <Page>
      { screen === 'form' && (
        <Link display="inline-flex" alignItems="center" mb={ 6 } onClick={ onGoBack }>
          <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)"/>
          { isMobile && <Text variant="inherit" fontSize="sm" ml={ 2 }>Public tags</Text> }
        </Link>
      ) }
      <PageTitle text={ header } display={{ base: 'block', lg: 'inline-flex' }} ml={{ base: 0, lg: 3 }}/>
      { content }
    </Page>
  );
};

export default PublicTagsComponent;
