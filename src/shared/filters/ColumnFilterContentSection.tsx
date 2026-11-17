// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'src/toolkit/chakra/button';

interface Props {
  title: string;
  onReset?: () => void;
  isFilled?: boolean;
  children: React.ReactNode;
}

const ColumnFilterContentSection = ({ title, onReset, isFilled, children }: Props) => {
  return (
    <Flex flexDir="column" rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 6 }>
        <Text color="text.secondary" fontWeight="600">{ title }</Text>
        { onReset && (
          <Button
            variant="link"
            onClick={ onReset }
            disabled={ !isFilled }
            textStyle="sm"
          >
            Reset
          </Button>
        ) }
      </Flex>
      { children }
    </Flex>
  );
};

export default React.memo(ColumnFilterContentSection);
