import { Text, Skeleton, Box } from '@chakra-ui/react';
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
  return (
    <Box { ...styles }>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontWeight="medium" color="#1E1E1E" opacity="0.4">
          { title }
        </Text>
      </Skeleton>
      <Text
        color="#292929"
        fontSize="medium"
        fontWeight="semibold"
        marginTop="1"
      >
        { children }
      </Text>
    </Box>
  );
};

export default NewDetailsInfoItem;
