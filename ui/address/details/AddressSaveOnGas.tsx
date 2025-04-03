import { useQuery } from '@tanstack/react-query';
import React from 'react';
import * as v from 'valibot';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TextSeparator from 'ui/shared/TextSeparator';

const feature = config.features.saveOnGas;

const responseSchema = v.object({
  percent: v.number(),
});

const ERROR_NAME = 'Invalid response schema';

interface Props {
  gasUsed: string;
  address: string;
}

const AddressSaveOnGas = ({ gasUsed, address }: Props) => {

  const gasUsedNumber = Number(gasUsed);

  const query = useQuery({
    queryKey: [ 'gas_hawk_saving_potential', { address } ],
    queryFn: async() => {
      if (!feature.isEnabled) {
        return;
      }

      const response = await fetch(feature.apiUrlTemplate.replace('<address>', address));
      const data = await response.json();
      return data;
    },
    select: (response) => {
      const parsedResponse = v.safeParse(responseSchema, response);

      if (!parsedResponse.success) {
        throw Error('Invalid response schema');
      }

      return parsedResponse.output;
    },
    placeholderData: { percent: 42 },
    enabled: feature.isEnabled && gasUsedNumber > 0,
  });

  const errorMessage = query.error && 'message' in query.error ? query.error.message : undefined;

  React.useEffect(() => {
    if (errorMessage === ERROR_NAME) {
      fetch('/node-api/monitoring/invalid-api-schema', {
        method: 'POST',
        body: JSON.stringify({
          resource: 'gas_hawk_saving_potential',
          url: feature.isEnabled ? feature.apiUrlTemplate.replace('<address>', address) : undefined,
        }),
      });
    }
  }, [ address, errorMessage ]);

  if (gasUsedNumber <= 0 || !feature.isEnabled || query.isError || !query.data?.percent) {
    return null;
  }

  const percent = Math.round(query.data.percent);

  if (percent < 1) {
    return null;
  }

  return (
    <>
      <TextSeparator color="border.divider"/>
      <Skeleton loading={ query.isPlaceholderData } display="flex" alignItems="center" columnGap={ 2 }>
        <Image src="/static/gas_hawk_logo.svg" w="15px" h="20px" alt="GasHawk logo"/>
        <Link href="https://www.gashawk.io?utm_source=blockscout&utm_medium=address" fontSize="sm" external>
          Save { percent.toLocaleString(undefined, { maximumFractionDigits: 0 }) }% with GasHawk
        </Link>
      </Skeleton>
    </>
  );
};

export default React.memo(AddressSaveOnGas);
