import { Heading } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
}

const AppErrorTitle = ({ title }: Props) => {
  return <Heading mt={ 8 } size="2xl" fontFamily="body">{ title }</Heading>;
};

export default AppErrorTitle;
