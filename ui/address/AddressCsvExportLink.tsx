import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { CsvExportParams } from 'types/client/address';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  address: string;
  params: CsvExportParams;
  className?: string;
  isLoading?: boolean;
}

const AddressCsvExportLink = ({ className, address, params, isLoading }: Props) => {
  const isMobile = useIsMobile();
  const isInitialLoading = useIsInitialLoading(isLoading);

  if (!config.features.csvExport.isEnabled) {
    return null;
  }

  if (isInitialLoading) {
    return (
      <Flex className={ className } flexShrink={ 0 } alignItems="center">
        <Skeleton loading boxSize={{ base: 8, lg: 6 }}/>
        <Skeleton loading hideBelow="lg" w="112px" h={ 6 } ml={ 1 }/>
      </Flex>
    );
  }

  return (
    <Tooltip disabled={ !isMobile } content="Download CSV">
      <Link
        className={ className }
        whiteSpace="nowrap"
        href={ route({ pathname: '/csv-export', query: { ...params, address } }) }
        flexShrink={ 0 }
      >
        <IconSvg name="files/csv" boxSize={{ base: '30px', lg: 6 }}/>
        <chakra.span ml={ 1 } hideBelow="lg">Download CSV</chakra.span>
      </Link>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressCsvExportLink));
