import { HStack, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

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

  const onLinkClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  if (isLast) {
    return (
      <>
        { text }
        <CopyToClipboard text={ href } type="link" mx={ 0 } color="text_secondary"/>
      </>
    );
  }

  return (
    <>
      <LinkInternal href={ href } onClick={ onLinkClick }>{ text }</LinkInternal>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 6 } color={ iconColor }/> }
    </>
  );
};

const AddressMudBreadcrumbs = (props: TableViewProps | RecordViewProps) => {
  const queryParams = { tab: 'mud', hash: props.hash };
  return (
    <HStack gap={ 2 } className={ props.className }>
      <IconSvg name="MUD" boxSize={ 5 } color="green.500"/>
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
          text={ props.tableName }
          href={ route({ pathname: '/address/[hash]', query: { ...queryParams, table_id: props.tableId, record_id: props.recordId } }) }
          isLast
          scrollRef={ props.scrollRef }

        />
      ) }
    </HStack>
  );
};

export default React.memo(chakra(AddressMudBreadcrumbs));
