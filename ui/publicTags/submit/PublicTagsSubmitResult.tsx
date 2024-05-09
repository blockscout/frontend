import { Alert, Box, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { FormSubmitResult } from './types';

import makePrettyLink from 'lib/makePrettyLink';
import LinkExternal from 'ui/shared/LinkExternal';

import PublicTagsSubmitResultSuccess from './result/PublicTagsSubmitResultSuccess';
import PublicTagsSubmitResultWithErrors from './result/PublicTagsSubmitResultWithErrors';

interface Props {
  data: FormSubmitResult;
}

const PublicTagsSubmitResult = ({ data }: Props) => {
  const hasErrors = data.some((item) => item.error !== null);
  const companyWebsite = makePrettyLink(data[0].payload.companyWebsite);

  return (
    <div>
      { !hasErrors && (
        <Alert status="success" mb={ 6 }>
        Success! All tags went into moderation pipeline and soon will appear in the explorer.
        </Alert>
      ) }

      <Box as="h2" textStyle="h4">Company info</Box>
      <Grid rowGap={ 3 } columnGap={ 6 } gridTemplateColumns="185px 1fr" mt={ 6 }>
        <GridItem>Your name</GridItem>
        <GridItem>{ data[0].payload.requesterName }</GridItem>
        <GridItem>Email</GridItem>
        <GridItem>{ data[0].payload.requesterEmail }</GridItem>
        { data[0].payload.companyName && (
          <>
            <GridItem>Company name</GridItem>
            <GridItem>{ data[0].payload.companyName }</GridItem>
          </>
        ) }
        { companyWebsite && (
          <>
            <GridItem>Company website</GridItem>
            <GridItem>
              <LinkExternal href={ companyWebsite.url }>{ companyWebsite.domain }</LinkExternal>
            </GridItem>
          </>
        ) }
      </Grid>

      <Box as="h2" textStyle="h4" mt={ 8 } mb={ 5 }>Public tags/labels</Box>
      { hasErrors ? <PublicTagsSubmitResultWithErrors data={ data }/> : <PublicTagsSubmitResultSuccess data={ data }/> }
    </div>
  );
};

export default PublicTagsSubmitResult;
