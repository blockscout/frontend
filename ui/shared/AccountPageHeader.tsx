import React from 'react';

import { Heading } from '@chakra-ui/react';

const PageHeader = ({ text }: {text: string}) => {
  return (
    <Heading as="h1" size="lg" marginBottom={ 8 }>{ text }</Heading>
  )
}

export default PageHeader;
