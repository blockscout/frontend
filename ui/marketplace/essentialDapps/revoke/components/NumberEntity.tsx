import { chakra, Text } from '@chakra-ui/react';

type Props = {
  value: string;
  suffix?: string;
  postfix?: string;
};

export default function NumberEntity({ value, suffix, postfix }: Props) {
  const [ integer, decimal ] = value.split('.');
  return (
    <Text>
      { suffix }
      { Number(integer) ? Number(integer).toLocaleString() : integer }
      { decimal && '.' }
      <chakra.span color="gray.500">{ decimal }</chakra.span>
      { postfix && ` ${ postfix }` }
    </Text>
  );
}
