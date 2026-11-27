// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React from 'react';

import { copy } from 'src/toolkit/utils/htmlEntities';

const FooterCopyright = (props: TextProps) => {
  return (
    <Text { ...props }>
      Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
    </Text>
  );
};

export default FooterCopyright;
