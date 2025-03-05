import {
  Card,
  CardBody,
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
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';

import MymachineSearchTop from './modules/mymachine-search-top';
import RestakeBtn from './modules/Restake-btn-dialog';
import UnstakeBtn from './modules/UnstakeBtn-btn-dialog';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import { fetchMachineData } from './modules/api/index';

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState([]); // 存储请求数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态

  const fetchMachineDataH = async () => {
    setLoading(true);
    try {
      const res: any = await fetchMachineData('0x1644d19216765FD18A112c7FAD74663CF1aEcf9F');
      if (res.code === 1000) {
        console.log(res.data, '拿到数据了');
        setMachineData(res.data); // 设置数据
      } else {
        throw new Error('Invalid response code');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineDataH();
  }, []);

  // thead 数据
  const thead = [
    { t: 'Staking', pcW: '80px', mobileW: '70px' },
    { t: 'GPU Type', pcW: '150px', mobileW: '90px' },
    { t: 'GPU Num', pcW: '100px', mobileW: '80px' },
    { t: 'Mem', pcW: '60px', mobileW: '50px' },
    { t: 'Project', pcW: '120px', mobileW: '110px' },
    { t: 'Total Reward', pcW: '120px', mobileW: '90px' },
    { t: 'Claimed', pcW: '110px', mobileW: '90px' },
    { t: 'Locked', pcW: '110px', mobileW: '80px' },
    { t: 'Actions' },
  ];

  // 从 machineData 映射到表格数据
  const tableBodyData =
    machineData.length > 0
      ? machineData.map((item: any) => ({
          v0: item.machineInfo.isStaking ? 'Yes' : 'No', // 是否在质押
          v1: item.machineInfo.gpuType || 'N/A', // GPU 类型
          v2: item.machineInfo.gpuCount, // GPU 数量
          v3: `${item.machineInfo.mem}G`, // 内存大小
          v4: item.machineInfo.projectName, // 项目名字
          v5: item.machineInfo.totalRewardAmount, // 总奖励数量
          v6: item.machineInfo.claimedRewardAmount, // 已领取奖励数量
          v7: item.machineInfo.lockedRewardAmount, // 锁仓奖励数量
          v11: [RestakeBtn, UnstakeBtn, WithdrawBtn], // 操作按钮
        }))
      : [
          // 默认 mock 数据
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
            v11: [RestakeBtn, UnstakeBtn, WithdrawBtn],
          },
        ];

  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });

  return (
    <Card variant="subtle">
      <CardHeader>
        <div className="flex flex-col w-full gap-4">
          <Heading size="md">Machine List</Heading>
          <MymachineSearchTop />
        </div>
      </CardHeader>
      <CardBody gap="2">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr sx={{ width: 'auto !important' }}>
                {thead.map((item, index) => (
                  <Th width={isMobile ? item.mobileW : item.pcW} key={index}>
                    <Skeleton isLoaded={!isPending}>{item.t}</Skeleton>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={thead.length}>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
              ) : error ? (
                <Tr>
                  <Td colSpan={thead.length}>Error: {error}</Td>
                </Tr>
              ) : (
                tableBodyData.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <Tooltip label="Staking status" aria-label="A tooltip">
                        <Skeleton isLoaded={!isPending}>
                          <Text mt={2}>{item.v0}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v1}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v2}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v3}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v4}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Tooltip label="Total rewards" aria-label="A tooltip">
                        <Skeleton isLoaded={!isPending}>
                          <Text mt={2}>{item.v5}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v6}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Text mt={2}>{item.v7}</Text>
                      </Skeleton>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
                        {item.v11.map((ItemComponent, index3) => (
                          <ItemComponent key={index3} />
                        ))}
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default Index;
