// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
  bg: string;
  value: string;
  label: string;
}

const SettingsSample = ({ label, value, bg, onClick, isActive }: Props) => {
  const bgColor = { base: 'white', _dark: 'gray.900' };
  const activeBorderColor = { base: 'blackAlpha.800', _dark: 'gray.50' };

  return (
    <Box p="9px" bgColor={ isActive ? 'selected.control.bg' : 'transparent' } borderRadius="base">
      <Tooltip content={ label }>
        <Box
          bg={ bg }
          boxSize="22px"
          borderRadius="full"
          borderWidth="1px"
          borderColor={ isActive ? 'selected.control.bg' : bgColor }
          position="relative"
          cursor="pointer"
          _before={{
            position: 'absolute',
            display: 'block',
            boxSizing: 'content-box',
            content: '""',
            top: '-3px',
            left: '-3px',
            width: 'calc(100% + 2px)',
            height: 'calc(100% + 2px)',
            borderStyle: 'solid',
            borderRadius: 'full',
            borderWidth: '2px',
            borderColor: isActive ? activeBorderColor : { _light: 'blackAlpha.300', _dark: 'whiteAlpha.300' },
          }}
          _hover={{
            _before: {
              borderColor: isActive ? activeBorderColor : 'hover',
            },
          }}
          data-value={ value }
          onClick={ onClick }
        />
      </Tooltip>
    </Box>
  );
};

export default React.memo(SettingsSample);
