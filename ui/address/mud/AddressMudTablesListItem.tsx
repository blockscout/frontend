import { Divider, Text, Skeleton, useBoolean, Flex, Link, VStack, chakra, Box, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import Tag from 'ui/shared/chakra/Tag';
import HashStringShorten from 'ui/shared/HashStringShorten';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressMudTableItem;
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
};

const AddressMudTablesListItem = ({ item, isLoading, scrollRef }: Props) => {
  const [ isOpened, setIsOpened ] = useBoolean(false);

  const router = useRouter();

  const onTableClick = React.useCallback((e: React.MouseEvent) => {
    const newQuery = {
      ...router.query,
      table_id: e.currentTarget.getAttribute('data-id') as string,
    };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    scrollRef?.current?.scrollIntoView();
  }, [ router, scrollRef ]);

  return (
    <ListItemMobile rowGap={ 3 } fontSize="sm" py={ 3 }>
      <Flex w="100%">
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
        <Box flexGrow="1">
          <Flex justifyContent="space-between" height={ 6 } alignItems="center" mb={ 3 }>
            <Skeleton isLoaded={ !isLoading }>
              <Link onClick={ onTableClick } data-id={ item.table.table_id } fontWeight={ 500 }>
                { item.table.table_full_name }
              </Link>
            </Skeleton>
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
              { item.table.table_type }
            </Skeleton>
          </Flex>
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            <HashStringShorten hash={ item.table.table_id } type="long"/>
          </Skeleton>
        </Box>
      </Flex>

      { isOpened && (
        <Grid templateColumns="48px 1fr" gap="8px 24px" fontWeight={ 500 } w="100%">
          { Boolean(item.schema.key_names.length) && (
            <>
              <Text lineHeight="24px">Key</Text>
              <VStack gap={ 1 } alignItems="start">
                { item.schema.key_names.map((name, index) => (
                  <Tag key={ name }>
                    <chakra.span fontWeight={ 700 }>{ item.schema.key_types[index] }</chakra.span> { name }
                  </Tag>
                )) }
              </VStack>
            </>
          ) }
          <GridItem colSpan={ 2 }><Divider/></GridItem>
          <Text lineHeight="24px">Value</Text>
          <VStack gap={ 1 } alignItems="start">
            { item.schema.value_names.map((name, index) => (
              <Text key={ name }>
                <chakra.span fontWeight={ 700 }>{ item.schema.value_types[index] }</chakra.span> { name }
              </Text>
            )) }
          </VStack>
        </Grid>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressMudTablesListItem);
