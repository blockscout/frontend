import { Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  key?: string;
}

const AccountListItemMobile = ({ children, className, key }: Props) => {
  return (
    <Flex
      as={ motion.div }
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={ key }
      rowGap={ 6 }
      alignItems="flex-start"
      flexDirection="column"
      paddingY={ 6 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
      className={ className }
    >
      { children }
    </Flex>
  );
};

export default chakra(AccountListItemMobile);
