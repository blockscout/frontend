import { Box, useColorModeValue, chakra, Grid } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import isBrowser from 'lib/isBrowser';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

import useAddressQuery from '../utils/useAddressQuery';

type TableViewProps = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  hash: string;
  tableId: string;
  tableName: string;
}

type RecordViewProps = TableViewProps & {
  recordId: string;
  recordName: string;
}

type BreadcrumbItemProps = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  text: string;
  href: string;
  isLast?: boolean;
}

const BreadcrumbItem = ({ text, href, isLast, scrollRef }: BreadcrumbItemProps) => {
  const iconColor = useColorModeValue('gray.300', 'gray.600');

  const currentUrl = isBrowser() ? window.location.href : '';

  const onLinkClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  if (isLast) {
    return (
      <Grid gap={ 2 } overflow="hidden" templateColumns="auto 24px" alignItems="center">
        <Box
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          { text }
        </Box>
        <CopyToClipboard text={ currentUrl } type="link" mx={ 0 } color="text_secondary"/>
      </Grid>
    );
  }

  return (
    <Grid gap={ 2 } overflow="hidden" templateColumns="auto 24px" alignItems="center">
      <LinkInternal
        href={ href }
        onClick={ onLinkClick }
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        { text }
      </LinkInternal>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 6 } color={ iconColor }/> }
    </Grid>
  );
};

const AddressMudBreadcrumbs = (props: TableViewProps | RecordViewProps) => {
  const queryParams = { tab: 'mud', hash: props.hash };
  const isMobile = useIsMobile();

  const addressQuery = useAddressQuery({ hash: props.hash });

  return (
    <Box
      display={ isMobile ? 'flex' : 'grid' }
      flexWrap="wrap"
      gridTemplateColumns="20px auto auto auto"
      gap={ 2 }
      alignItems="center"
      className={ props.className }
      width="fit-content"
      fontSize="sm"
    >
      <IconSvg name="MUD" boxSize={ 5 } color={ addressQuery.data?.is_verified ? 'green.500' : 'text_secondary' }/>
      <BreadcrumbItem
        text="MUD World"
        href={ route({ pathname: '/address/[hash]', query: queryParams }) }
        scrollRef={ props.scrollRef }
      />
      <BreadcrumbItem
        text={ props.tableName }
        href={ route({ pathname: '/address/[hash]', query: { ...queryParams, table_id: props.tableId } }) }
        isLast={ !('recordId' in props) }
        scrollRef={ props.scrollRef }
      />
      { ('recordId' in props) && (
        <BreadcrumbItem
          text={ props.recordName }
          href={ route({ pathname: '/address/[hash]', query: { ...queryParams, table_id: props.tableId, record_id: props.recordId } }) }
          isLast
          scrollRef={ props.scrollRef }

        />
      ) }
    </Box>
  );
};

export default React.memo(chakra(AddressMudBreadcrumbs));
