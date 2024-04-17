import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import SearchBar from 'ui/snippets/searchBar/SearchBar';
type Props={
  title: string;
}

const SearchContainer = ({ title }: Props) => {
  const headingBgColor = useColorModeValue('black', 'blue.1000');
  return (
    <div>
      <Box
        w={{ base: '90%', md: '100%' }}
        maxWidth="1360px"
        mx="auto"
        px="3em"
        my="3em"
        background={ headingBgColor }
        borderRadius="24px"
        padding={{ base: '24px', lg: '48px' }}
        minW={{ base: '300px', lg: '900px' }}
        data-label="hero plate"
      >
        <Flex
          mb={{ base: 6, lg: 8 }}
          justifyContent="center"
          alignItems="center"
        >
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'xl' }}
            lineHeight={{ base: '32px', lg: '50px' }}
            fontWeight={ 600 }
            bgGradient="linear(to-r, #FFFFFF 25.04%, rgba(255, 255, 255, 0) 137.07%)"
            bgClip="text"
            color="transparent"
          >
            { title }
          </Heading>
        </Flex>
        <SearchBar isHomepage/>
      </Box>
    </div>
  );
};

export default SearchContainer;
