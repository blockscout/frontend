import { chakra, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

type Props = {
  value: number;
};

export default function DateEntity({ value }: Props) {
  return (
    <Text>
      { format(new Date(value), 'dd.MM.yyyy') }{ ' ' }
      <chakra.span color="text.secondary">
        { format(new Date(value), 'h:mm aa') }
      </chakra.span>
    </Text>
  );
}
