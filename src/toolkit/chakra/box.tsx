// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export const BoxHtml = ({ html, ...props }: { html: string } & BoxProps) => {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: html }}
      css={{
        '& a': {
          color: 'link.primary',
          _hover: {
            color: 'link.primary.hover',
          },
        },
      }}
      { ...props }
    />
  );
};
