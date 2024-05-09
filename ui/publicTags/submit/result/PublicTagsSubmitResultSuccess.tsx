import { Box } from '@chakra-ui/react';
import React from 'react';

import type { FormSubmitResult } from '../types';

interface Props {
  data: FormSubmitResult;
}

const PublicTagsSubmitResultSuccess = (props: Props) => {
  return <Box>{ props.data.length }</Box>;
};

export default PublicTagsSubmitResultSuccess;
