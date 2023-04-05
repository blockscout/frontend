import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  id: number;
}

const TokenInfoForm = ({ id }: Props) => {
  return <Box>TokenInfoForm for { id }</Box>;
};

export default TokenInfoForm;
