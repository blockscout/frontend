import { Heading } from '@chakra-ui/react';
import React from 'react';

import * as PageTitle from '../PageTitle';

const Composite = () => {
  const backLink = {
    label: 'Back to tokens list',
    url: 'http://localhost:3000/tokens',
  };

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <span>TOP ROW</span>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          <Heading as="h1" size="lg">
            MAIN CONTENT
          </Heading>
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent>
          SECONDARY CONTENT
        </PageTitle.SecondaryContent>
      </PageTitle.MainRow>
      <PageTitle.BottomRow>
        BOTTOM ROW
      </PageTitle.BottomRow>
    </PageTitle.Container>
  );
};

export default Composite;
