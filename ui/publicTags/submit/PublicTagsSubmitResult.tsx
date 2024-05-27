import { Alert, Box, Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import _pickBy from 'lodash/pickBy';
import React from 'react';

import type { FormSubmitResult } from './types';

import { route } from 'nextjs-routes';

import makePrettyLink from 'lib/makePrettyLink';
import LinkExternal from 'ui/shared/links/LinkExternal';

import PublicTagsSubmitResultSuccess from './result/PublicTagsSubmitResultSuccess';
import PublicTagsSubmitResultWithErrors from './result/PublicTagsSubmitResultWithErrors';
import { groupSubmitResult } from './utils';

interface Props {
  data: FormSubmitResult | undefined;
}

const PublicTagsSubmitResult = ({ data }: Props) => {
  const groupedData = React.useMemo(() => groupSubmitResult(data), [ data ]);

  if (!groupedData) {
    return null;
  }

  const hasErrors = groupedData.items.some((item) => item.error !== null);
  const companyWebsite = makePrettyLink(groupedData.companyWebsite);
  const startOverButtonQuery = hasErrors ? _pickBy({
    requesterName: groupedData.requesterName,
    requesterEmail: groupedData.requesterEmail,
    companyName: groupedData.companyName,
    companyWebsite: groupedData.companyWebsite,
  }, Boolean) : undefined;

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

      <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 6 } mt={ 8 } rowGap={ 3 }>
        { hasErrors && (
          <Button size="lg" variant="outline" as="a" href={ route({ pathname: '/public-tags/submit', query: startOverButtonQuery }) }>
            Start over
          </Button>
        ) }
        <Button size="lg" as="a" href={ route({ pathname: '/public-tags/submit' }) }>Add new tag</Button>
      </Flex>
    </div>
  );
};

export default React.memo(PublicTagsSubmitResult);
