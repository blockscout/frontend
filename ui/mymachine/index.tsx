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
} from '@chakra-ui/react';
import React from 'react';
// import IconSvg from 'ui/shared/IconSvg';

function index() {
  // thead数据
  const thead = [
    {
      t: '机器ID',
      w: '50px',
    },
    {
      t: 'GPU型号',
      w: '50px',
    },
    {
      t: 'GPU数量',
      w: '50px',
    },
    {
      t: '内存',
      w: '30px',
    },
    {
      t: '挖矿的项目名称',
      w: '70px',
    },
    {
      t: 'AI容器id',
      w: '50px',
    },
    {
      t: 'AI模型名称',
      w: '50px',
    },
    {
      t: '累计收益',
      w: '50px',
    },
    {
      t: '已提取的收益',
      w: '50px',
    },
    {
      t: '锁定的收益',
      w: '50px',
    },
    {
      t: '状态',
      w: '90px',
    },
    {
      t: '操作',
      w: '140px',
    },
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
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
      v10: [ 'Re-plg', 'Unplg' ],
      v11: [ 'St Min', 'Stp Min', 'Wd Earn' ],
    },
  ];
  return (
    <Card variant="subtle">
      <CardHeader>
        <Heading size="md">Machine List</Heading>
      </CardHeader>
      <CardBody gap="2">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr sx={{ width: 'auto !important' }}>
                { thead.map((item, index) => {
                  return (
                    <Th width={ item.w } key={ index }>
                      { item.t }
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
                        <Text mt={ 2 }>{ item.v0 }</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v1 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v2 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v3 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v4 }</Text>
                    </Td>
                    <Td>
                      <Tooltip label="Hey, I'm here!" aria-label="A tooltip">
                        <Text mt={ 2 }>{ item.v5 }</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v6 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v7 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v8 }</Text>
                    </Td>
                    <Td>
                      <Text mt={ 2 }>{ item.v9 }</Text>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
                        { item.v10.map((item2, index2) => {
                          return (
                            <Button size="sm" variant="outline" key={ index2 }>
                              { item2 }
                            </Button>
                          );
                        }) }
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
                        { item.v11.map((item3, index3) => {
                          return (
                            <Button size="sm" variant="outline" key={ index3 }>
                              { item3 }
                            </Button>
                          );
                        }) }
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
