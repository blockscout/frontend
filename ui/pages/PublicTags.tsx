import React, { useCallback, useState } from 'react';
import { animateScroll } from 'react-scroll';

import {
  Box,
  useToast,
} from '@chakra-ui/react';

import Page from 'ui/shared/Page/Page';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import PublicTagsData from 'ui/publicTags/PublicTagsData';
import PublicTagsForm from 'ui/publicTags/PublicTagsForm/PublicTagsForm';

import type { TPublicTagItem } from 'data/publicTags';

type TScreen = 'data' | 'form';

type TToastAction = 'added' | 'removed';

const toastDescriptions = {
  added: 'Your request sent to moderator. Waiting for...',
  removed: 'Tags have been removed.',
} as Record<TToastAction, string>;

const PublicTags: React.FC = () => {
  const [ screen, setScreen ] = useState<TScreen>('data');
  const [ formData, setFormData ] = useState<TPublicTagItem>();

  const toast = useToast();

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

  const changeToFormScreen = useCallback((data?: TPublicTagItem) => {
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
      <Box h="100%">
        <AccountPageHeader text={ header }/>
        { content }
      </Box>
    </Page>
  );
};

export default PublicTags;
