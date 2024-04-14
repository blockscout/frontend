import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import React from 'react';

// Define the props by extending the ButtonProps from Chakra UI
interface BWButtonProps extends ButtonProps {
  active?: boolean; // explicitly declare 'active' prop which is used in this component
}

const BWButton: React.FC<BWButtonProps> = ({ active, ...props }) => {
  return (
    <Button
      backgroundColor={ active ? 'black' : '#F4F4F4' }
      color={ active ? 'white' : 'black' }
      _hover={{
        backgroundColor: 'black',
        color: 'white',
      }}
      fontSize="12px"
      borderRadius="1.7em"
      padding="1.5em"
      { ...props } // Spread the rest of the props to the Button component
    >
      { props.children }
    </Button>
  );
};

export default BWButton;
