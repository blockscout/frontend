import {
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Flex,
  Link,
  Image,
} from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import Popover from 'ui/shared/chakra/Popover';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

const externalTxFeature = config.features.externalTxs;

interface Props {
  data: Array<string>;
}

const TxExternalTxs: React.FC<Props> = ({ data }) => {
  if (!externalTxFeature.isEnabled) {
    return null;
  }

  return (
    <Popover placement="bottom-end" openDelay={ 300 } isLazy trigger="hover">
      <PopoverTrigger>
        <Link
          _hover={{ textDecoration: 'none', color: 'link_hovered' }}
          display="inline-flex"
          alignItems="center"
          gap={ 2 }
        >
          <Image src={ externalTxFeature.chainLogoUrl } alt={ externalTxFeature.chainName } width={ 5 } height={ 5 }/>
          { data.length } { externalTxFeature.chainName } txn{ data.length > 1 ? 's' : '' }
        </Link>
      </PopoverTrigger>
      <PopoverContent border="1px solid" borderColor="divider" w={{ base: '300px', lg: '460px' }}>
        <PopoverBody fontWeight={ 400 } fontSize="sm">
          <Flex alignItems="center" gap={ 2 } fontSize="md" mb={ 3 }>
            <Image src={ externalTxFeature.chainLogoUrl } alt={ externalTxFeature.chainName } width={ 5 } height={ 5 }/>
            { externalTxFeature.chainName } transaction{ data.length > 1 ? 's' : '' }
          </Flex>
          <Flex flexDirection="column" gap={ 2 } w="100%" maxHeight="460px" overflowY="auto">
            { data.map((txHash) => (
              <TxEntity
                key={ txHash }
                hash={ txHash }
                href={ externalTxFeature.explorerUrlTemplate.replace('{hash}', txHash) }
                isExternal
              />
            )) }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TxExternalTxs;
