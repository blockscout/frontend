import { chakra, Box, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { Heading } from 'toolkit/chakra/heading';
import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

const BlockCountdownIndex = () => {
  const router = useRouter();

  const handleFormSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const searchTerm = formData.get('search_term');
    if (typeof searchTerm === 'string' && searchTerm) {
      router.push({ pathname: '/block/countdown/[height]', query: { height: searchTerm } }, undefined, { shallow: true });
    }
  }, [ router ]);

  return (
    <Center h="100%" justifyContent={{ base: 'flex-start', lg: 'center' }} flexDir="column" textAlign="center" pt={{ base: 8, lg: 0 }}>
      <IconSvg
        name="block_countdown"
        color={{ _light: 'gray.300', _dark: 'gray.600' }}
        w={{ base: '160px', lg: '240px' }}
        h={{ base: '123px', lg: '184px' }}
      />
      <Heading
        level="1"
        mt={{ base: 3, lg: 6 }}
      >
        Block countdown
      </Heading>
      <Box mt={ 2 }>
        The estimated time for a block to be created and added to the blockchain.
      </Box>
      <chakra.form
        noValidate
        onSubmit={ handleFormSubmit }
        w={{ base: '100%', lg: '360px' }}
        mt={{ base: 3, lg: 6 }}
      >
        <FilterInput
          placeholder="Search by block number"
          size="sm"
          type="number"
          name="search_term"
        />
      </chakra.form>
    </Center>
  );
};

export default React.memo(BlockCountdownIndex);
