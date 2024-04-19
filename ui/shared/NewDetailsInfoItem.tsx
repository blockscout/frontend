/* eslint-disable quotes */
import { Text, Skeleton, Box, useColorModeValue } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';

interface Props extends Omit<HTMLChakraProps<'div'>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}

const NewDetailsInfoItem = ({
  title,
  children,
  isLoading,
  ...styles
}: Props) => {
  const color = useColorModeValue('gray.1200', "gray.1100");
  const titleColor = useColorModeValue("#1E1E1E", "gray.1300");

  return (
    <Box { ...styles }>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontWeight="medium" color={ titleColor } opacity="0.4">
          { title }
        </Text>
      </Skeleton>
      <Text color={ color } fontSize="medium" fontWeight="semibold" marginTop="1">
        { children }
      </Text>
    </Box>
  );
};

export default NewDetailsInfoItem;
