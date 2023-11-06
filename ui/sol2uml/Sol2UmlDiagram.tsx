import { chakra, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import ContentLoader from 'ui/shared/ContentLoader';

interface Props {
  addressHash: string;
}

function composeSources(contract: SmartContract | undefined) {
  if (!contract) {
    return {};
  }
  const additionalSources = contract.additional_sources?.reduce<Record<string, string>>((result, item) => {
    result[item.file_path] = item.source_code;
    return result;
  }, {});

  return {
    [contract.file_path || 'index.sol']: contract.source_code,
    ...additionalSources,
  };
}

const Sol2UmlDiagram = ({ addressHash }: Props) => {
  const contractQuery = useApiQuery<'contract', ResourceError>('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  const umlQuery = useApiQuery('visualize_sol2uml', {
    fetchParams: {
      method: 'POST',
      body: {
        sources: composeSources(contractQuery.data),
      },
    },
    queryOptions: {
      enabled: Boolean(contractQuery.data),
      refetchOnMount: false,
    },
  });

  const imgUrl = `data:image/svg+xml;base64,${ umlQuery.data?.svg }`;
  const imgFilter = useColorModeValue('invert(0)', 'invert(1)');

  const handleClick = React.useCallback(() => {
    const image = new Image();
    image.src = imgUrl;

    const newWindow = window.open(imgUrl);
    newWindow?.document.write(image.outerHTML);
  }, [ imgUrl ]);

  if (!addressHash) {
    throw Error('Contract address is not provided', { cause: { status: 404 } as unknown as Error });
  }

  if (contractQuery.isError) {
    throw Error('Contract fetch error', { cause: contractQuery.error as unknown as Error });
  }

  if (umlQuery.isError) {
    throw Error('Uml diagram fetch error', { cause: contractQuery.error as unknown as Error });
  }

  if (contractQuery.isPending || umlQuery.isPending) {
    return <ContentLoader/>;
  }

  if (!umlQuery.data.svg) {
    return <span>No data for visualization</span>;
  }

  return (
    <Tooltip label="Click on image to zoom" placement="top">
      <chakra.img
        src={ `data:image/svg+xml;base64,${ umlQuery.data.svg }` }
        alt={ `Contract ${ contractQuery.data.name } UML diagram` }
        onClick={ handleClick }
        cursor="pointer"
        filter={ imgFilter }
      />
    </Tooltip>
  );
};

export default React.memo(Sol2UmlDiagram);
