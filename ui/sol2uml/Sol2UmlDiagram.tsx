import { chakra, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type * as visualizer from '@blockscout/visualizer-types';
import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import ContentLoader from 'ui/shared/ContentLoader';

interface Props {
  addressHash: string;
}

function composeSources(contract: SmartContract | undefined): visualizer.VisualizeStorageRequest['sources'] {
  if (!contract) {
    return {};
  }
  const additionalSources = contract.additional_sources?.reduce<Record<string, string>>((result, item) => {
    result[item.file_path] = item.source_code;
    return result;
  }, {});

  return {
    [contract.file_path || 'index.sol']: contract.source_code || '',
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
      queryKey: [ 'visualize_sol2uml', addressHash ],
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

  throwOnAbsentParamError(addressHash);
  throwOnResourceLoadError(contractQuery);
  throwOnResourceLoadError(umlQuery);

  if (contractQuery.isPending || umlQuery.isPending) {
    return <ContentLoader/>;
  }

  if (!umlQuery.data?.svg || !contractQuery.data) {
    return <span>No data for visualization</span>;
  }

  return (
    <Tooltip label="Click on image to zoom" placement="top">
      <chakra.img
        src={ imgUrl }
        alt={ `Contract ${ contractQuery.data.name } UML diagram` }
        onClick={ handleClick }
        cursor="pointer"
        filter={ imgFilter }
      />
    </Tooltip>
  );
};

export default React.memo(Sol2UmlDiagram);
