import { Tr, Td, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Epoch } from 'types/api/epoch';

import { route } from 'nextjs-routes';

import Skeleton from 'ui/shared/chakra/Skeleton';
import LinkInternal from 'ui/shared/links/LinkInternal';

interface Props {
  data: Epoch;
  isLoading?: boolean;
}

const EpochTableItem = ({ data, isLoading }: Props) => {
  return (
    <Tr
      as={ motion.tr }
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={ data.id }
    >
      <Td fontSize="sm">
        <Flex columnGap={ 2 } alignItems="center" mb={ 2 }></Flex>
        <LinkInternal
          href={ route({
            pathname: '/epoch/[id]',
            query: { id: data.id },
          }) }
        >
          { data.id }
        </LinkInternal>
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { data.endTime }
        </Skeleton>
      </Td>
      <Td fontSize="sm">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { data.duration }
        </Skeleton>
      </Td>
      <Td fontSize="sm" textAlign="start">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { data.epochFee }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(EpochTableItem);
