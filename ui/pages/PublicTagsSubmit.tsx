import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';

type Screen = 'form' | 'result';

const PublicTagsSubmit = () => {

  const [ screen ] = React.useState<Screen>('form');

  const content = (() => {
    switch (screen) {
      case 'form':
        return 'FORM';
      case 'result':
        return 'RESULT';
      default:
        return null;
    }
  })();

  return (
    <>
      <PageTitle title="Request a public tag/label"/>
      { content }
    </>
  );
};

export default PublicTagsSubmit;
