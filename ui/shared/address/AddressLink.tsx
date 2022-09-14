import { Link, chakra } from '@chakra-ui/react';
import React from 'react';

import useLink from 'lib/link/useLink';

interface Props {
  children: React.ReactNode;
  type?: 'address' | 'transaction' | 'token';
  hash?: string;
  className?: string;
}

const AddressLink = ({ children, type, className, ...props }: Props) => {
  const link = useLink();
  let url;
  if (type === 'transaction') {
    url = link('tx_index', { id: props.hash });
  } else if (type === 'token') {
    url = link('token_index', { id: props.hash });
  } else {
    url = link('address_index', { id: props.hash });
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...props });
    }

    return child;
  });

  return (
    <Link
      className={ className }
      href={ url }
      target="_blank"
      overflow="hidden"
      whiteSpace="nowrap"
    >
      { childrenWithProps }
    </Link>
  );
};

const AddressLinkChakra = chakra(AddressLink);

export default React.memo(AddressLinkChakra);
