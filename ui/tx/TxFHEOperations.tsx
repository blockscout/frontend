import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { FheOperationType } from 'types/api/fheOperations';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'toolkit/chakra/table';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxFHEOperations = ({ txQuery }: Props) => {
  const hash = txQuery.data?.hash || '';
  const isEnabled = Boolean(hash) && Boolean(txQuery.data?.status);

  const { data, isLoading, isError } = useApiQuery('general:tx_fhe_operations', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled,
      retry: false,
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && txQuery.data && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading || txQuery.isPlaceholderData || !hash) {
    return (
      <Box>
        <Skeleton height="100px" mb={ 6 }/>
        <Skeleton height="400px"/>
      </Box>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.items || data.items.length === 0 || data.operation_count === 0) {
    return (
      <Box>
        <Text mb={ 4 }>No FHE operations found in this transaction.</Text>
      </Box>
    );
  }

  const { items, total_hcu: totalHcu, max_depth_hcu: maxDepthHcu, operation_count: operationCount } = data;

  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, calc(33.333% - 8px))' }}
        gap={ 3 }
        mb={ 6 }
      >
        <StatsWidget
          label="Total HCU"
          hint="Sum of all Homomorphic Computation Units consumed by FHE operations in this transaction"
          value={ (totalHcu || 0).toLocaleString() }
          isLoading={ isLoading }
        />
        <StatsWidget
          label="Max Depth HCU"
          hint="Maximum HCU consumed at any single depth level in the FHE operation tree"
          value={ (maxDepthHcu || 0).toLocaleString() }
          isLoading={ isLoading }
        />
        <StatsWidget
          label="Operations"
          hint="Total number of FHE operations executed in this transaction"
          value={ (operationCount || items.length).toLocaleString() }
          isLoading={ isLoading }
        />
      </Box>

      { /* Operations Table */ }
      <AddressHighlightProvider>
        <Box maxW="100%" overflowX="auto" hideBelow="lg">
          <TableRoot tableLayout="fixed" minWidth="900px" w="100%">
            <TableHeader>
              <TableRow>
                <TableColumnHeader width="10%">Index</TableColumnHeader>
                <TableColumnHeader width="15%">Operation</TableColumnHeader>
                <TableColumnHeader width="12%">Type</TableColumnHeader>
                <TableColumnHeader width="12%">FHE Type</TableColumnHeader>
                <TableColumnHeader width="12%">Mode</TableColumnHeader>
                <TableColumnHeader width="12%" isNumeric>HCU Cost</TableColumnHeader>
                <TableColumnHeader width="12%" isNumeric>HCU Depth</TableColumnHeader>
                <TableColumnHeader width="24%">Caller</TableColumnHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              { items.map((op, index) => {
                const hcuDepth = op.hcu_depth ?? op.hcu_cost;

                return (
                  <TableRow key={ op.log_index || index }>
                    <TableCell>
                      <Text fontFamily="mono" fontSize="sm">
                        { op.log_index }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontFamily="mono" fontSize="sm" fontWeight="medium">
                        { op.operation }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge colorPalette={ getTypeColor(op.type) } fontSize="xs">
                        { op.type }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text fontFamily="mono" fontSize="sm">
                        { op.fhe_type }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge colorPalette={ op.is_scalar ? 'green' : 'blue' } fontSize="xs">
                        { op.is_scalar ? 'Scalar' : 'Non-Scalar' }
                      </Badge>
                    </TableCell>
                    <TableCell isNumeric>
                      <Text fontFamily="mono" fontSize="sm" fontWeight="bold">
                        { op.hcu_cost.toLocaleString() }
                      </Text>
                    </TableCell>
                    <TableCell isNumeric>
                      <Text fontFamily="mono" fontSize="sm" color="text.secondary">
                        { hcuDepth.toLocaleString() }
                      </Text>
                    </TableCell>
                    <TableCell verticalAlign="middle">
                      { op.caller && op.caller.hash ? (
                        <AddressEntity
                          address={ op.caller }
                          truncation="constant"
                          isLoading={ isLoading }
                        />
                      ) : (
                        <Text fontSize="sm" color="text.secondary">—</Text>
                      ) }
                    </TableCell>
                  </TableRow>
                );
              }) }
            </TableBody>
          </TableRoot>
        </Box>

        <Box hideFrom="lg">
          { items.map((op, index) => {
            const hcuDepth = op.hcu_depth ?? op.hcu_cost;
            return (
              <ListItemMobile key={ op.log_index || index }>
                <Flex direction="column" gap={ 3 } width="100%">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontFamily="mono" fontSize="md" fontWeight="bold">
                      { op.operation }
                    </Text>
                    <Text fontFamily="mono" fontSize="xs" color="text.secondary">
                      #{ op.log_index }
                    </Text>
                  </Flex>

                  <Flex gap={ 2 } flexWrap="wrap">
                    <Badge colorPalette={ getTypeColor(op.type) } fontSize="xs">
                      { op.type }
                    </Badge>
                    <Badge colorPalette="gray" variant="outline" fontSize="xs">
                      { op.fhe_type }
                    </Badge>
                    <Badge colorPalette={ op.is_scalar ? 'green' : 'blue' } fontSize="xs">
                      { op.is_scalar ? 'Scalar' : 'Non-Scalar' }
                    </Badge>
                  </Flex>

                  <Flex justifyContent="space-between" alignItems="center">
                    <Text color="text.secondary" fontSize="sm">Caller</Text>
                    { op.caller && op.caller.hash ? (
                      <AddressEntity
                        address={ op.caller }
                        truncation="constant"
                        isLoading={ isLoading }
                      />
                    ) : (
                      <Text fontSize="sm" color="text.secondary">—</Text>
                    ) }
                  </Flex>

                  <Flex justifyContent="space-between" alignItems="center">
                    <Text color="text.secondary" fontSize="sm">HCU Cost</Text>
                    <Text fontFamily="mono" fontSize="sm" fontWeight="medium">
                      { op.hcu_cost.toLocaleString() }
                    </Text>
                  </Flex>

                  <Flex justifyContent="space-between" alignItems="center">
                    <Text color="text.secondary" fontSize="sm">HCU Depth</Text>
                    <Text fontFamily="mono" fontSize="sm" color="text.secondary">
                      { hcuDepth.toLocaleString() }
                    </Text>
                  </Flex>
                </Flex>
              </ListItemMobile>
            );
          }) }
        </Box>
      </AddressHighlightProvider>
    </Box>
  );
};

function getTypeColor(type: FheOperationType): 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'cyan' | 'pink' | 'gray' {
  const colors: Record<FheOperationType, 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'cyan' | 'pink' | 'gray'> = {
    arithmetic: 'blue',
    bitwise: 'purple',
    comparison: 'orange',
    unary: 'green',
    control: 'red',
    encryption: 'cyan',
    random: 'pink',
  };
  return colors[type] || 'gray';
}

export default React.memo(TxFHEOperations);
