import { Text, Alert, Link, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
}

const SocketAlert = ({ className }: Props) => {
  return (
    <Alert status="warning" className={ className }>
      <Text whiteSpace="pre">Connection lost, click </Text>
      <Link href={ window.document.location.href }>to load newer records</Link>
    </Alert>
  );
};

export default chakra(SocketAlert);
