import { Flex, Box, Tooltip, useClipboard, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import useFetch from 'lib/hooks/useFetch';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import FilterInput from 'ui/shared/filters/FilterInput';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatFileSize = (fileSizeInBytes: number) => `${ (fileSizeInBytes / 1_024).toFixed(2) } Kb`;

interface IconInfo {
  name: string;
  file_size: number;
}

const Item = ({ name, file_size: fileSize, bgColor }: IconInfo & { bgColor: string }) => {
  const { hasCopied, onCopy } = useClipboard(name, 1000);
  const [ copied, setCopied ] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      maxW="100px"
      textAlign="center"
      onClick={ onCopy }
      cursor="pointer"
    >
      <IconSvg name={ name.replace('.svg', '') as IconName } boxSize="100px" bgColor={ bgColor } borderRadius="base"/>
      <Tooltip label={ copied ? 'Copied' : 'Copy to clipboard' } isOpen={ copied }>
        <Box fontWeight={ 500 } mt={ 2 }>{ name }</Box>
      </Tooltip>
      <Box color="text_secondary">{ formatFileSize(fileSize) }</Box>
    </Flex>
  );
};

const Sprite = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const bgColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const fetch = useFetch();
  const { data, isFetching, isError } = useQuery({
    queryKey: [ 'sprite' ],
    queryFn: () => {
      return fetch<Array<IconInfo>, unknown>('/icons/registry.json');
    },
  });

  const content = (() => {
    if (isFetching) {
      return <ContentLoader/>;
    }

    if (isError || !data || !Array.isArray(data)) {
      return <DataFetchAlert/>;
    }

    const items = data
      .filter((icon) => icon.name.includes(searchTerm))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (items.length === 0) {
      return <EmptySearchResult text="No icons found"/>;
    }

    return (
      <Flex flexWrap="wrap" fontSize="sm" columnGap={ 5 } rowGap={ 5 } justifyContent="flex-start">
        { items.map((item) => <Item key={ item.name } { ...item } bgColor={ bgColor }/>) }
      </Flex>
    );
  })();

  const total = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return;
    }
    return data.reduce((result, item) => {
      result.num++;
      result.fileSize += item.file_size;
      return result;
    }, { num: 0, fileSize: 0 });
  }, [ data ]);

  const searchInput = <FilterInput placeholder="Search by name..." onChange={ setSearchTerm } isLoading={ isFetching } minW={{ base: '100%', lg: '300px' }}/>;
  const totalEl = total ? <Box ml="auto">Items: { total.num } / Size: { formatFileSize(total.fileSize) }</Box> : null;

  const contentAfter = (
    <>
      { totalEl }
      { searchInput }
    </>
  );

  return (
    <div>
      <PageTitle title="SVG sprite 🥤" contentAfter={ contentAfter }/>
      { content }
    </div>
  );
};

export default React.memo(Sprite);
