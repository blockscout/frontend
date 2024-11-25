import type {
  PopoverBodyProps,
  PopoverContentProps,
  PopoverProps } from '@chakra-ui/react';
import {
  Skeleton,
  DarkMode,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';

import IconSvg from './IconSvg';

interface Props {
  label: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  popoverProps?: Partial<PopoverProps>;
  popoverContentProps?: Partial<PopoverContentProps>;
  popoverBodyProps?: Partial<PopoverBodyProps>;
}

const HintPopover = ({ label, isLoading, className, popoverProps, popoverContentProps, popoverBodyProps }: Props) => {
  const bgColor = useColorModeValue('gray.700', 'gray.900');

  if (isLoading) {
    return <Skeleton className={ className } boxSize={ 5 } borderRadius="sm"/>;
  }

  return (
    <Popover trigger="hover" isLazy placement="top" { ...popoverProps }>
      <PopoverTrigger>
        <IconSvg className={ className } name="info" boxSize={ 5 } color="icon_info" _hover={{ color: 'link_hovered' }} cursor="pointer"/>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bgColor={ bgColor } maxW={{ base: 'calc(100vw - 8px)', lg: '320px' }} borderRadius="sm" { ...popoverContentProps }>
          <PopoverArrow bgColor={ bgColor }/>
          <PopoverBody color="white" fontSize="sm" lineHeight="20px" px={ 2 } py="2px" { ...popoverBodyProps }>
            <DarkMode>
              { label }
            </DarkMode>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default React.memo(chakra(HintPopover));
