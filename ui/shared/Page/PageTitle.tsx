import { Heading, chakra } from '@chakra-ui/react';
import React from 'react';

const PageTitle = ({ text, className }: {text: string; className?: string}) => {
  return (
    <Heading as="h1" size="lg" marginBottom={ 6 } className={ className }>{ text }</Heading>
  );
};

export default chakra(PageTitle);
