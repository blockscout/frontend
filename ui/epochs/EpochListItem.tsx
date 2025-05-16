import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { Epoch } from 'types/api/epoch';

import { route } from 'nextjs-routes';

import Skeleton from 'ui/shared/chakra/Skeleton';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: Epoch;
  isLoading?: boolean;
}

const EpochListItem = ({ data, isLoading }: Props) => {

  return (
    <ListItemMobile rowGap={ 3 } key={ String(data.id) } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">

          <LinkInternal
            href={ route({
              pathname: '/epoch/[id]',
              query: { id: data.id },
            }) }
          >
            { data.id }
          </LinkInternal>
        </Flex>
        <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
          <span>{ data.endTime }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Duration</Text>
        <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
          <span>{ data.duration }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Epoch Fee</Text>
        <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
          <span>{ data.epochFee }</span>
        </Skeleton>
      </Flex>

    </ListItemMobile>
  );
};

export default EpochListItem;
