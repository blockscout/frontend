import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { FormSubmitResult } from '../types';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';

interface Props {
  data: FormSubmitResult;
}

const PublicTagsSubmitResultSuccess = (props: Props) => {
  const isMobile = useIsMobile();

  return (
    <Grid gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 3 } columnGap={ 3 }>
      <GridItem>
        <Box fontSize="sm" color="text_secondary" fontWeight={ 500 }>Smart contract / Address (0x...)</Box>
        <Flex flexDir="column" rowGap={ 3 } mt={ 2 }>
          { props.data
            .map((item) => item.payload.addresses)
            .flat()
            .map((item) => <AddressEntity key={ item.hash } address={ item } noIcon truncation={ isMobile ? 'constant' : 'dynamic' }/>) }
        </Flex>
      </GridItem>
      <GridItem>
        <Box fontSize="sm" color="text_secondary" fontWeight={ 500 }>Tag</Box>
        <Flex rowGap={ 2 } columnGap={ 2 } mt={ 2 } justifyContent="flex-start" flexWrap="wrap">
          { props.data
            .map((item) => item.payload.tags)
            .flat()
            .map((item) => (
              <EntityTag
                key={ item.name }
                truncate
                data={{
                  name: item.name,
                  tagType: item.type.value,
                  meta: {
                    bgColor: item.bgColor ? `#${ item.bgColor }` : undefined,
                    textColor: item.textColor ? `#${ item.textColor }` : undefined,
                    tooltipDescription: item.tooltipDescription,
                    tagUrl: item.url,
                  },
                  slug: item.name,
                  ordinal: 0,
                }}/>
            )) }
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default React.memo(PublicTagsSubmitResultSuccess);
