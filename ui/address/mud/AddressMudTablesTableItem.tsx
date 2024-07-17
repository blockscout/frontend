import { Td, Tr, Text, Skeleton, useBoolean, Link, Table, VStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import Tag from 'ui/shared/chakra/Tag';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  item: AddressMudTableItem;
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
};

const AddressMudTablesTableItem = ({ item, isLoading, scrollRef }: Props) => {
  const [ isOpened, setIsOpened ] = useBoolean(false);

  const router = useRouter();

  const onTableClick = React.useCallback((e: React.MouseEvent) => {
    const newQuery = {
      ...router.query,
      table_id: e.currentTarget.getAttribute('data-id') as string,
    };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ router, scrollRef ]);

  return (
    <>
      <Tr borderStyle={ isOpened ? 'hidden' : 'unset' }>
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading }>
            <Link display="block">
              <IconSvg
                name="arrows/east-mini"
                transform={ isOpened ? 'rotate(270deg)' : 'rotate(180deg)' }
                boxSize={ 6 }
                cursor="pointer"
                onClick={ setIsOpened.toggle }
                transitionDuration="faster"
              />
            </Link>
          </Skeleton>
        </Td>
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading }>
            <Link onClick={ onTableClick } data-id={ item.table.table_id }>
              { item.table.table_full_name }
            </Link>
          </Skeleton>
        </Td>
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading }>
            { item.table.table_id }
          </Skeleton>
        </Td>
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading }>
            { item.table.table_type }
          </Skeleton>
        </Td>
      </Tr>
      { isOpened && (
        <Tr>
          <Td pt={ 0 }></Td>
          <Td colSpan={ 3 } pt={ 0 }>
            <Table>
              { Boolean(item.schema.key_names.length) && (
                <Tr>
                  <Td width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 }>Key</Td>
                  <Td py={ 2 }>
                    <VStack gap={ 1 } alignItems="start">
                      { item.schema.key_names.map((name, index) => (
                        <Tag key={ name }>
                          <chakra.span fontWeight={ 700 }>{ item.schema.key_types[index] }</chakra.span> { name }
                        </Tag>
                      )) }
                    </VStack>
                  </Td>
                </Tr>
              ) }
              <Tr borderBottomStyle="hidden">
                <Td width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 }>Value</Td>
                <Td fontSize="sm" py={ 2 }>
                  <VStack gap={ 1 } alignItems="start">
                    { item.schema.value_names.map((name, index) => (
                      <Text key={ name }>
                        <chakra.span fontWeight={ 700 }>{ item.schema.value_types[index] }</chakra.span> { name }
                      </Text>
                    )) }
                  </VStack>
                </Td>
              </Tr>
            </Table>
          </Td>
        </Tr>
      ) }
    </>
  );
};

export default React.memo(AddressMudTablesTableItem);
