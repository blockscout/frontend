import {
  Box,
  Tooltip,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
  bg: string;
  value: string;
  label: string;
}

const TOOLTIP_OFFSET: [ number, number ] = [ 0, 10 ];

const SettingsSample = ({ label, value, bg, onClick, isActive }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const activeBgColor = useColorModeValue('blue.50', 'whiteAlpha.100');

  const activeBorderColor = useToken('colors', useColorModeValue('blackAlpha.800', 'gray.50'));
  const hoverBorderColor = useToken('colors', 'link_hovered');

  return (
    <Box p="9px" bgColor={ isActive ? activeBgColor : 'transparent' } borderRadius="base">
      <Tooltip label={ label } offset={ TOOLTIP_OFFSET }>
        <Box
          bg={ bg }
          boxSize="22px"
          borderRadius="full"
          borderWidth="1px"
          borderColor={ isActive ? activeBgColor : bgColor }
          position="relative"
          cursor="pointer"
          _before={{
            position: 'absolute',
            display: 'block',
            content: '""',
            top: '-3px',
            left: '-3px',
            width: 'calc(100% + 2px)',
            height: 'calc(100% + 2px)',
            borderStyle: 'solid',
            borderRadius: 'full',
            borderWidth: '2px',
            borderColor: isActive ? activeBorderColor : 'transparent',
          }}
          _hover={{
            _before: {
              borderColor: isActive ? activeBorderColor : hoverBorderColor,
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
