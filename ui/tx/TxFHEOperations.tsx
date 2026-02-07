import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
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
        <Skeleton loading height="100px" mb={ 6 }/>
        <Skeleton loading height="400px"/>
      </Box>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data || !data.items || data.items.length === 0 || data.operation_count === 0) {
    return (
      <Box>
        <Text mb={ 4 }>There are no FHE Operations for this transaction.</Text>
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
                <TableColumnHeader width="12%">HCU Cost</TableColumnHeader>
                <TableColumnHeader width="12%">HCU Depth</TableColumnHeader>
                <TableColumnHeader width="24%">Caller</TableColumnHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              { items.map((op, index) => {
                const hcuDepth = op.hcu_depth ?? op.hcu_cost;

                return (
                  <TableRow key={ op.log_index || index }>
                    <TableCell>
                      <Text fontSize="sm">
                        { op.log_index }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontSize="sm" fontWeight="medium">
                        { op.operation }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge colorPalette={ getTypeColor(op.type) } fontSize="xs">
                        { capitalize(op.type) }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge colorPalette="gray" fontSize="xs">
                        { op.fhe_type }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge colorPalette="gray" fontSize="xs">
                        { op.is_scalar ? 'Scalar' : 'Non-Scalar' }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text fontSize="sm">
                        { op.hcu_cost.toLocaleString() }
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontSize="sm" color="text.secondary">
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
                <Flex gap={ 2 } flexWrap="wrap" mb={ 3 } alignItems="center">
                  <Badge colorPalette={ getTypeColor(op.type) } fontSize="xs">
                    { capitalize(op.type) }
                  </Badge>
                  <Badge colorPalette="gray" fontSize="xs">
                    { op.fhe_type }
                  </Badge>
                  <Badge colorPalette="gray" fontSize="xs">
                    { op.is_scalar ? 'Scalar' : 'Non-Scalar' }
                  </Badge>
                </Flex>

                <Grid templateColumns="110px 1fr" rowGap={ 3 } columnGap={ 2 }>
                  <Text fontSize="md" fontWeight="medium" color="text.primary">Index</Text>
                  <Text fontSize="md" color="text.secondary">
                    { op.log_index }
                  </Text>

                  <Text fontSize="md" fontWeight="medium" color="text.primary">Operation</Text>
                  <Text fontSize="md" color="text.secondary">
                    { op.operation }
                  </Text>

                  <Text fontSize="md" fontWeight="medium" color="text.primary">HCU cost</Text>
                  <Text fontSize="md" color="text.secondary">
                    { op.hcu_cost.toLocaleString() }
                  </Text>

                  <Text fontSize="md" fontWeight="medium" color="text.primary">HCU depth</Text>
                  <Text fontSize="md" color="text.secondary">
                    { hcuDepth.toLocaleString() }
                  </Text>

                  <Text fontSize="md" fontWeight="medium" color="text.primary">Caller</Text>
                  <Box>
                    { op.caller && op.caller.hash ? (
                      <AddressEntity
                        address={ op.caller }
                        truncation="constant"
                        isLoading={ isLoading }
                      />
                    ) : (
                      <Text fontSize="md" color="text.secondary">—</Text>
                    ) }
                  </Box>
                </Grid>
              </ListItemMobile>
            );
          }) }
        </Box>
      </AddressHighlightProvider>
    </Box>
  );
};

// Maps FHE operation types to Blockscout color palette
function getTypeColor(type: FheOperationType): 'purple' | 'orange' | 'blue' | 'yellow' | 'teal' | 'cyan' | 'pink' | 'gray' {
  const colors: Record<FheOperationType, 'purple' | 'orange' | 'blue' | 'yellow' | 'teal' | 'cyan' | 'pink' | 'gray'> = {
    comparison: 'purple',
    control: 'orange',
    arithmetic: 'blue',
    bitwise: 'teal',
    encryption: 'cyan',
    unary: 'yellow',
    random: 'pink',
  };
  return colors[type] || 'gray';
}

export default React.memo(TxFHEOperations);
