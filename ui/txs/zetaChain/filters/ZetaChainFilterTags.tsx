import { Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXFilterParams } from 'types/api/zetaChain';

import dayjs from 'lib/date/dayjs';
import shortenString from 'lib/shortenString';
import { Link } from 'toolkit/chakra/link';
import { Tag } from 'toolkit/chakra/tag';
import IconSvg from 'ui/shared/IconSvg';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  filters: ZetaChainCCTXFilterParams;
  onClearFilter: (key: keyof ZetaChainCCTXFilterParams) => () => void;
  onClearAll: () => void;
};

const ZetaChainFilterTags = ({ filters, onClearFilter, onClearAll }: Props) => {
  const { data: chains = [] } = useZetaChainConfig();

  const filterTags: Array<{ key: keyof ZetaChainCCTXFilterParams; name: string; value: string }> = [];

  // Age filter
  if (filters.start_timestamp || filters.end_timestamp) {
    const from = filters.start_timestamp ? dayjs(Number(filters.start_timestamp) * 1000).format('MMM DD, YYYY') : '';
    const to = filters.end_timestamp ? dayjs(Number(filters.end_timestamp) * 1000).format('MMM DD, YYYY') : '';
    filterTags.push({
      key: 'start_timestamp',
      name: 'Age',
      value: `${ from } - ${ to }`,
    });
  }

  // Status filter
  if (filters.status_reduced && filters.status_reduced.length > 0) {
    filterTags.push({
      key: 'status_reduced',
      name: 'Status',
      value: filters.status_reduced.join(', '),
    });
  }

  // Sender filter
  if (filters.sender_address && filters.sender_address.length > 0) {
    filterTags.push({
      key: 'sender_address',
      name: 'Sender',
      value: filters.sender_address.map(address => shortenString(address, 8)).join(', '),
    });
  }

  // Sender chain filter
  if (filters.source_chain_id && filters.source_chain_id.length > 0) {
    const chainNames = filters.source_chain_id.map(chainId => {
      const chain = chains.find(c => c.chain_id.toString() === chainId);
      return chain?.chain_name || `Chain ${ chainId }`;
    });
    filterTags.push({
      key: 'source_chain_id',
      name: 'Sender Chain',
      value: chainNames.join(', '),
    });
  }

  // Receiver filter
  if (filters.receiver_address && filters.receiver_address.length > 0) {
    filterTags.push({
      key: 'receiver_address',
      name: 'Receiver',
      value: filters.receiver_address.map(address => shortenString(address, 8)).join(', '),
    });
  }

  // Receiver chain filter
  if (filters.target_chain_id && filters.target_chain_id.length > 0) {
    const chainNames = filters.target_chain_id.map(chainId => {
      const chain = chains.find(c => c.chain_id.toString() === chainId);
      return chain?.chain_name || `Chain ${ chainId }`;
    });
    filterTags.push({
      key: 'target_chain_id',
      name: 'Receiver Chain',
      value: chainNames.join(', '),
    });
  }

  // Asset filter
  if (filters.token_symbol) {
    filterTags.push({
      key: 'token_symbol',
      name: 'Asset',
      value: filters.token_symbol.join(', '),
    });
  }

  if (filterTags.length === 0) {
    return null;
  }

  return (
    <Flex alignItems="center" gap={ 2 } mb={ 6 }>
      <Text fontSize="lg" lineHeight="24px" w="100px">Filtered by:</Text>
      <HStack gap={ 2 } flexWrap="wrap">
        { filterTags.map(t => (
          <Tag key={ t.name } variant="filter" onClose={ onClearFilter(t.key) } closable label={ t.name }>
            { t.value }
          </Tag>
        )) }
      </HStack>
      { filterTags.length !== 0 && (
        <Link onClick={ onClearAll } display="flex" alignItems="center" justifyContent="end" gap={ 2 } fontSize="sm" w="150px">
          <IconSvg name="repeat" boxSize={ 5 }/>
          Reset filters
        </Link>
      ) }
    </Flex>
  );
};

export default ZetaChainFilterTags;
