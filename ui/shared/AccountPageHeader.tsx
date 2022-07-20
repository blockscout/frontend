import React from 'react';

import { Heading } from '@chakra-ui/react';

const PageHeader = ({ header }: {header: string}) => {
  return (
    <Heading as="h1" size="lg" marginBottom={ 8 }>{ header }</Heading>
  )
}

export default PageHeader;
