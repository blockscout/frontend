import { chakra, Icon, Tooltip, Hide } from '@chakra-ui/react';
import React from 'react';

import type { CsvExportType } from 'types/client/address';

import svgFileIcon from 'icons/files/csv.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  address: string;
  type: CsvExportType;
  className?: string;
}

const AddressCsvExportLink = ({ className, address, type }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Tooltip isDisabled={ !isMobile } label="Download CSV">
      <LinkInternal
        className={ className }
        display="inline-flex"
        alignItems="center"
        href={ link('csv_export', undefined, { type, address }) }
      >
        <Icon as={ svgFileIcon } boxSize={{ base: '30px', lg: 6 }}/>
        <Hide ssr={ false } below="lg"><chakra.span ml={ 1 }>Download CSV</chakra.span></Hide>
      </LinkInternal>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressCsvExportLink));
