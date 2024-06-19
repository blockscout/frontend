import React from 'react';

import type { Props } from './ContractMethodResultPublicClient';
import ContractMethodResultPublicClient from './ContractMethodResultPublicClient';

export const ErrorStory = (props: Omit<Props, 'data'>) => {
  const result = new Error('Something went wrong');

  return <ContractMethodResultPublicClient { ...props } data={ result }/>;
};
