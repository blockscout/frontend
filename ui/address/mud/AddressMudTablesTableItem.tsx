import { Td, Tr, Text, Skeleton, useBoolean, Link, Table, VStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import { route } from 'nextjs-routes';

import Tag from 'ui/shared/chakra/Tag';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  item: AddressMudTableItem;
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  hash: string;
};

const AddressMudTablesTableItem = ({ item, isLoading, scrollRef, hash }: Props) => {
  const [ isOpened, setIsOpened ] = useBoolean(false);

  const router = useRouter();

  const onTableClick = React.useCallback((e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // Allow opening in a new tab/window with right-click or ctrl/cmd+click
      return;
    }

    e.preventDefault();

    const tableId = e.currentTarget.getAttribute('data-id');
    if (tableId) {
      router.push(
        { pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: tableId } },
        undefined,
        { shallow: true },
      );
    }
    scrollRef?.current?.scrollIntoView();
  }, [ router, scrollRef, hash ]);

  return (
    <>
      <Tr borderBottomStyle={ isOpened ? 'hidden' : 'unset' }>
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
                aria-label="View schema"
              />
            </Link>
          </Skeleton>
        </Td>
        <Td verticalAlign="middle">
          <Skeleton isLoaded={ !isLoading }>
            <LinkInternal
              href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: item.table.table_id } }) }
              data-id={ item.table.table_id }
              onClick={ onTableClick }
              fontWeight={ 700 }
            >
              { item.table.table_full_name }
            </LinkInternal>
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
                  <Td width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 } pl={ 0 } verticalAlign="middle">Key</Td>
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
                <Td width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 } pl={ 0 } >Value</Td>
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
