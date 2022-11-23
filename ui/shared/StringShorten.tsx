import { Tooltip } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  maxLength: number;
}

const StringShorten = ({ title, maxLength }: Props) => {
  if (title.length > maxLength) {
    return (
      <Tooltip label={ title }>
        { title.slice(0, maxLength) + '...' }
      </Tooltip>
    );
  } else {
    return title;
  }
};

export default StringShorten;
