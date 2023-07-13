import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { animateScroll } from 'react-scroll';

import type { PublicTag } from 'types/api/account';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import useToast from 'lib/hooks/useToast';
import getQueryParamString from 'lib/router/getQueryParamString';
import PublicTagsData from 'ui/publicTags/PublicTagsData';
import PublicTagsForm from 'ui/publicTags/PublicTagsForm/PublicTagsForm';
import PageTitle from 'ui/shared/Page/PageTitle';

type TScreen = 'data' | 'form';

type TToastAction = 'added' | 'removed';

const toastDescriptions = {
  added: 'Your request sent to moderator. Waiting for...',
  removed: 'Tags have been removed.',
} as Record<TToastAction, string>;

const PublicTagsComponent: React.FC = () => {
  const router = useRouter();
  const addressHash = getQueryParamString(router.query.address);

  const [ screen, setScreen ] = useState<TScreen>(addressHash ? 'form' : 'data');
  const [ formData, setFormData ] = useState<Partial<PublicTag> | undefined>(addressHash ? { addresses: [ addressHash ] } : undefined);

  const toast = useToast();
  useRedirectForInvalidAuthToken();

  React.useEffect(() => {
    addressHash && router.replace({ pathname: '/account/public-tags-request' });
  // componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

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

  const backLink = {
    label: 'Public tags',
    onClick: onGoBack,
  };

  return (
    <>
      <PageTitle
        title={ header }
        backLink={ screen === 'form' ? backLink : undefined }
        display={{ base: 'block', lg: 'inline-flex' }}
      />
      { content }
    </>
  );
};

export default PublicTagsComponent;
