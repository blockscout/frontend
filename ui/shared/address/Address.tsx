import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  hash: string;
  className?: string;
  children: React.ReactNode;
}

const Address = ({ children, className, ...props }: Props) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...props, text: props.hash } as Partial<unknown>);
    }

    return child;
  });

  return <Flex alignItems="center" overflow="hidden" className={ className }>{ childrenWithProps }</Flex>;
};

const AddressChakra = chakra(Address);

export default React.memo(AddressChakra);
