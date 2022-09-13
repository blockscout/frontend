import { Link, chakra } from '@chakra-ui/react';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';

interface Props {
  children: React.ReactNode;
  type?: 'address' | 'transaction' | 'token';
  hash?: string;
  className?: string;
}

const AddressLink = ({ children, type, className, ...props }: Props) => {
  const basePath = useBasePath();
  let url;
  if (type === 'transaction') {
    url = basePath + '/tx/' + props.hash;
  } else if (type === 'token') {
    url = basePath + '/address/' + props.hash + '/tokens#address-tabs';
  } else {
    url = basePath + '/address/' + props.hash;
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
