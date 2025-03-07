import {
  Image,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import type { NetworkExplorer as TNetworkExplorer } from 'types/networks';

import config from 'configs/app';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import VerifyWith from 'ui/shared/VerifyWith';

interface Props {
  className?: string;
  type: keyof TNetworkExplorer['paths'];
  pathParam: string;
}

const NetworkExplorers = ({ className, type, pathParam }: Props) => {
  const defaultIconColor = useColorModeValue('gray.400', 'gray.500');

  const explorersLinks = React.useMemo(() => {
    return config.UI.explorers.items
      .filter((explorer) => typeof explorer.paths[type] === 'string')
      .map((explorer) => {
        const url = new URL(stripTrailingSlash(explorer.paths[type] || '') + '/' + pathParam, explorer.baseUrl);
        return (
          <LinkExternal h="34px" key={ explorer.baseUrl } href={ url.toString() } alignItems="center" display="inline-flex" minW="120px">
            { explorer.logo ?
              <Image boxSize={ 5 } mr={ 2 } src={ explorer.logo } alt={ `${ explorer.title } icon` }/> :
              <IconSvg name="explorer" boxSize={ 5 } color={ defaultIconColor } mr={ 2 }/>
            }
            { explorer.title }
          </LinkExternal>
        );
      });
  }, [ pathParam, type, defaultIconColor ]);

  if (explorersLinks.length === 0) {
    return null;
  }

  return (
    <VerifyWith
      className={ className }
      links={ explorersLinks }
      label="Verify with other explorers"
      longText={ `${ explorersLinks.length } Explorer${ explorersLinks.length > 1 ? 's' : '' }` }
      shortText={ explorersLinks.length.toString() }
    />
  );
};

export default React.memo(chakra(NetworkExplorers));
