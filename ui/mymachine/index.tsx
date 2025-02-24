import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Tooltip,
  TableContainer,
  CardHeader,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React, { useEffect } from 'react';

// import IconSvg from 'ui/shared/IconSvg';
import useIsMobile from 'lib/hooks/useIsMobile';

import MymachineSearchTop from './modules/mymachine-search-top';
import RestakeBtn from './modules/Restake-btn-dialog';
import UnstakeBtn from './modules/UnstakeBtn-btn-dialog';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';

function index() {
  const isMobile = useIsMobile();

  // thead数据
  const thead = [
    { t: 'ID', pcW: '50px', mobileW: '70px' },
    { t: 'GPU', pcW: '50px', mobileW: '90px' },
    { t: 'Count', pcW: '50px', mobileW: '80px' },
    { t: 'RAM', pcW: '30px', mobileW: '50px' },
    { t: 'Project', pcW: '70px', mobileW: '110px' },
    { t: 'Container', pcW: '50px', mobileW: '90px' },
    { t: 'Model', pcW: '50px', mobileW: '90px' },
    { t: 'Earnings', pcW: '50px', mobileW: '80px' },
    { t: 'Withdrawn', pcW: '70px', mobileW: '90px' },
    { t: 'Locked', pcW: '60px', mobileW: '90px' },
    { t: 'Actions', pcW: '180px', mobileW: '220px' },
  ];

  // mock的tbody数据
  const tableBodyData = [
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
    {
      v0: 'Mach ID',
      v1: 'GPU Mod',
      v2: 'GPU N',
      v3: 'Mem',
      v4: 'Min Proj Nm',
      v5: 'AI Cont ID',
      v6: 'AI Mod Nm',
      v7: 'Cum Earn',
      v8: 'Wd Earn',
      v9: 'Lckd Earn',
      v11: [ RestakeBtn, UnstakeBtn, WithdrawBtn ],
    },
  ];
  const [ isPending, start ] = useTimeoutFn(
    () => {
      console.log('已经3s了', isPending);
    },
    2000,
    { immediate: true },
  );
  return (
    <Card variant="subtle">
      <CardHeader>
        <div className="flex flex-col w-full gap-4">
          <Heading size="md">Machine List</Heading>
          <MymachineSearchTop/>
        </div>
      </CardHeader>
      <CardBody gap="2">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr sx={{ width: 'auto !important' }}>
                { thead.map((item, index) => {
                  return (
                    <Th width={ isMobile ? item.mobileW : item.pcW } key={ index }>
                      <Skeleton isLoaded={ !isPending }>{ item.t }</Skeleton>
                    </Th>
                  );
                }) }
              </Tr>
            </Thead>
            <Tbody>
              { tableBodyData.map((item, index) => {
                return (
                  <Tr key={ index }>
                    <Td>
                      <Tooltip label="Hey, I'm here!" aria-label="A tooltip">
                        <Skeleton isLoaded={ !isPending }>
                          <Text mt={ 2 }>{ item.v0 }</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v1 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v2 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v3 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v4 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Tooltip label="Hey, I'm here!" aria-label="A tooltip">
                        <Skeleton isLoaded={ !isPending }>
                          <Text mt={ 2 }>{ item.v5 }</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v6 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v7 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v8 }</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={ !isPending }>
                        <Text mt={ 2 }>{ item.v9 }</Text>
                      </Skeleton>
                    </Td>

                    <Td>
                      <div className="flex items-center gap-x-3">
                        { item.v11.map((ItemComponent, index3) => (
                          <ItemComponent key={ index3 }/>
                        )) }
                      </div>
                    </Td>
                  </Tr>
                );
              }) }
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
      { /* <CardFooter justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </CardFooter> */ }
    </Card>
  );
}

export default index;
