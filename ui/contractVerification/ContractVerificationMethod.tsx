import { Grid, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const ContractVerificationMethod = ({ title, children }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section ref={ ref }>
      <Text fontWeight={ 500 } fontSize="lg" fontFamily="heading" mt={ 12 } mb={ 5 }>{ title }</Text>
      <Grid columnGap="30px" rowGap={{ base: 2, lg: 5 }} templateColumns={{ base: '1fr', lg: 'minmax(0, 680px) minmax(0, 340px)' }}>
        { children }
      </Grid>
    </section>
  );
};

export default React.memo(ContractVerificationMethod);
