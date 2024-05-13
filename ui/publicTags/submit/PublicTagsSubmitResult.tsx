import { Alert, Box, Button, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { FormSubmitResult } from './types';

import { route } from 'nextjs-routes';

import makePrettyLink from 'lib/makePrettyLink';
import LinkExternal from 'ui/shared/LinkExternal';

import PublicTagsSubmitResultSuccess from './result/PublicTagsSubmitResultSuccess';
import PublicTagsSubmitResultWithErrors from './result/PublicTagsSubmitResultWithErrors';
import { groupSubmitResult } from './utils';

interface Props {
  data: FormSubmitResult;
}

const PublicTagsSubmitResult = ({ data }: Props) => {
  const groupedData = React.useMemo(() => groupSubmitResult(data), [ data ]);
  const hasErrors = groupedData.items.some((item) => item.error !== null);
  const companyWebsite = makePrettyLink(groupedData.companyWebsite);

  return (
    <div>
      { !hasErrors && (
        <Alert status="success" mb={ 6 }>
          Success! All tags went into moderation pipeline and soon will appear in the explorer.
        </Alert>
      ) }

      <Box as="h2" textStyle="h4">Company info</Box>
      <Grid rowGap={ 3 } columnGap={ 6 } gridTemplateColumns="170px 1fr" mt={ 6 }>
        <GridItem>Your name</GridItem>
        <GridItem>{ groupedData.requesterName }</GridItem>
        <GridItem>Email</GridItem>
        <GridItem>{ groupedData.requesterEmail }</GridItem>
        { groupedData.companyName && (
          <>
            <GridItem>Company name</GridItem>
            <GridItem>{ groupedData.companyName }</GridItem>
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
      { hasErrors ? <PublicTagsSubmitResultWithErrors data={ groupedData }/> : <PublicTagsSubmitResultSuccess data={ groupedData }/> }

      <Button size="lg" mt={ 8 } as="a" href={ route({ pathname: '/public-tags/submit' }) }>Add new tag</Button>
    </div>
  );
};

export default React.memo(PublicTagsSubmitResult);
