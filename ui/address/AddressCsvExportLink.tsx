import { chakra, Icon, Link, Tooltip } from '@chakra-ui/react';
import React from 'react';

import svgFileIcon from 'icons/svg_file.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';

interface Props {
  address: string;
  type: 'transactions' | 'internal-transactions' | 'token-transfers';
  className?: string;
}

const AddressCsvExportLink = ({ className, address, type }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Tooltip isDisabled={ !isMobile } label="Download CSV">
      <Link
        className={ className }
        display="inline-flex"
        alignItems="center"
        href={ link('csv_export', undefined, { type, address }) }
      >
        <Icon as={ svgFileIcon } boxSize={ 6 }/>
        { !isMobile && <chakra.span ml={ 1 }>Download CSV</chakra.span> }
      </Link>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressCsvExportLink));
