import { Tag, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  baseAddress: string;
  addressFrom: string;
  className?: string;
}

const InOutTag = ({ baseAddress, addressFrom, className }: Props) => {
  const isOut = addressFrom === baseAddress;
  const colorScheme = isOut ? 'orange' : 'green';

  return <Tag className={ className } colorScheme={ colorScheme }>{ isOut ? 'OUT' : 'IN' }</Tag>;
};

export default React.memo(chakra(InOutTag));
