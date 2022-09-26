import { Heading } from '@chakra-ui/react';
import React from 'react';

const PageTitle = ({ text }: {text: string}) => {
  return (
    <Heading as="h1" size="lg" marginBottom={{ base: 6, lg: 8 }}>{ text }</Heading>
  );
};

export default PageTitle;
