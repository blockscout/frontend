import { Flex, Text, Box, chakra } from '@chakra-ui/react';

import type { AddressWidget } from 'types/client/addressWidget';

import { Image } from 'toolkit/chakra/image';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import IconSvg from 'ui/shared/IconSvg';

import useWidgetData from './useWidgetData';

type Props = {
  name: string;
  config: AddressWidget | undefined;
  address: string;
  isConfigLoading: boolean;
};

const AddressWidgetCard = ({ name, config, address, isConfigLoading }: Props) => {
  const { data, isLoading: isDataLoading } = useWidgetData(name, config?.value, address, isConfigLoading);

  const isLoading = isConfigLoading || isDataLoading;

  if (!config) {
    return null;
  }

  const [ integer, decimal ] = data?.split('.') || [];

  const separator = <Box h="1px" w="full" mt={ 3 } mb={ 2 } bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}/>;

  const content = isLoading ? (
    <>
      <Skeleton loading w="88px" h="40px" mb={ 1 }/>
      <Skeleton loading w="178px" h="20px"/>
      { separator }
      <Flex alignItems="center" gap={ 2 }>
        <Skeleton loading w="20px" h="20px"/>
        <Skeleton loading w="80px" h="20px"/>
      </Flex>
    </>
  ) : (
    <>
      <LinkOverlay href={ config.url.replace(':address', address) } external/>
      { data ? (
        <Text
          textStyle="heading.xl"
          color={ integer === '0' && !decimal ? 'text.secondary' : 'text.primary' }
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          { integer }
          { decimal && (
            <>
              .
              <chakra.span color="text.secondary">
                { decimal }
              </chakra.span>
            </>
          ) }
        </Text>
      ) : (
        <Text textStyle="heading.xl" color="gray.500" opacity={ 0.2 }>--</Text>
      ) }
      <Flex alignItems="center" gap={ 1 } mt={ 1 }>
        <Text textStyle="sm">{ config.title }</Text>
        { config.hint && (
          <Hint
            label={ config.hint }
            tooltipProps={{ positioning: { placement: 'bottom' } }}
          />
        ) }
      </Flex>
      { separator }
      <Flex alignItems="center" gap={ 2 }>
        <Image src={ config.icon } alt={ config.name } boxSize={ 5 }/>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flex={ 1 }
        >
          <Text
            textStyle="xs"
            color="text.secondary"
            _groupHover={{ color: 'blue.400' }}
          >
            { config.name }
          </Text>
          <IconSvg
            name="link_external"
            boxSize={ 3 }
            color="blue.400"
            display="none"
            _groupHover={{ display: 'block' }}
          />
        </Flex>
      </Flex>
    </>
  );

  return (
    <LinkBox className="group">
      <Flex
        flexDirection="column"
        p={ 3 }
        bgColor={ isLoading ? 'transparent' : { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }
        borderRadius="md"
        border="1px solid"
        borderColor={ isLoading ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : 'transparent' }
        _groupHover={{ borderColor: isLoading ? 'default' : 'blue.400' }}
        cursor={ isLoading ? 'default' : 'pointer' }
      >
        { content }
      </Flex>
    </LinkBox>
  );
};

export default AddressWidgetCard;
