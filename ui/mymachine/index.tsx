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
  Button,
  Link,
  HStack,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';
import MymachineSearchTop from './modules/mymachine-search-top';
import RestakeBtn from './modules/Restake-btn-dialog';
import UnstakeBtn from './modules/UnstakeBtn-btn-dialog';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import { fetchMachineData } from './modules/api/index';
import { IoCopy, IoCheckmark, IoCashOutline, IoLockClosedOutline } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { FaCoins } from 'react-icons/fa'; // 使用 FaCoins 图标表示代币奖励

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState([]); // 存储请求数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const { address, isConnected } = useAccount();

  // 重新渲染
  const [key, setKey] = useState(0);
  const fetchMachineDataH = async () => {
    setLoading(true);
    try {
      const res: any = await fetchMachineData(address);
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
  }, [key]);

  // thead 数据
  const thead = [
    { t: 'Machine ID', pcW: '200px', mobileW: '70px' },
    { t: 'Staking', pcW: '70px', mobileW: '60px' },
    { t: 'GPU Type', pcW: '80px', mobileW: '70px' },
    { t: 'GPU Num', pcW: '80px', mobileW: '80px' },
    { t: 'Mem', pcW: '60px', mobileW: '50px' },
    { t: 'Project', pcW: '80px', mobileW: '60px' },
    { t: 'Total Reward', pcW: '100px', mobileW: '100px' },
    { t: 'Claimed', pcW: '85px', mobileW: '65px' },
    { t: 'Locked', pcW: '100px', mobileW: '65px' },
    { t: 'Actions' },
  ];

  // 从 machineData 映射到表格数据
  const tableBodyData =
    machineData.length > 0
      ? machineData.map((item: any) => ({
          machineId: item.machineId,
          v0: item.machineInfo.isStaking, // 是否在质押
          v1: item.machineInfo.gpuType || 'N/A', // GPU 类型
          v2: 1, // GPU 数量
          v3: `${item.machineInfo.mem}G`, // 内存大小
          v4: item.machineInfo.projectName, // 项目名字
          v5: item.machineInfo.totalRewardAmount, // 总奖励数量
          v6: item.machineInfo.claimedRewardAmount, // 已领取奖励数量
          v7: item.machineInfo.lockedRewardAmount, // 锁仓奖励数量
          v11: [RestakeBtn, UnstakeBtn, WithdrawBtn], // 操作按钮
        }))
      : [];

  // 复制组件
  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const CopyButton = ({ text }) => {
    console.log(text, 'text');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后恢复

      // 复制逻辑（假设要复制 "Hello, World!"）
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('复制失败:', err);
      });
    };

    return (
      <span className="cursor-pointer" onClick={handleCopy}>
        {copied ? <IoCheckmark size={18} className="text-green-600" /> : <IoCopy size={18} />}
      </span>
    );
  };

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
              <Tr>
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
                      <Tooltip label={`Machine ID: ${item.machineId}`}>
                        <Skeleton isLoaded={!isPending}>
                          <div className="flex items-center gap-x-2">
                            <Text className="cursor-pointer truncate">{item.machineId}</Text>
                            <CopyButton text={item.machineId} />
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <div className="flex items-center space-x-2">
                          {item.v0 ? (
                            <>
                              <IoCheckmarkCircle size={20} className="text-green-500" />
                              <span className="text-green-600 font-medium">Yes</span>
                            </>
                          ) : (
                            <>
                              <IoCloseCircle size={20} className="text-red-500" />
                              <span className="text-red-600 font-medium">No</span>
                            </>
                          )}
                        </div>
                      </Skeleton>
                    </Td>

                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Tooltip label={`GPU type: ${item.v1}`}>
                          <Skeleton isLoaded={!isPending}>
                            <Text className="truncate">{item.v1}</Text>
                          </Skeleton>
                        </Tooltip>
                      </Skeleton>
                    </Td>

                    <Td>
                      <Skeleton isLoaded={!isPending}>
                        <Tooltip label={`GPU count: ${item.v2.toString()}`}>
                          <Skeleton isLoaded={!isPending}>
                            <Text color="blue.500">{item.v2}</Text>
                          </Skeleton>
                        </Tooltip>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Tooltip label={`Memory size: ${item.v3}`}>
                        <Skeleton isLoaded={!isPending}>
                          <Text color="blue.500">{item.v3}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>

                    <Td>
                      <Tooltip label={`Project name: ${item.v4}`}>
                        <Skeleton isLoaded={!isPending}>
                          <Text className="truncate">{item.v4}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip
                        label={`Total reward amount: ${item.v5}`}
                        hasArrow
                        placement="top"
                        bg="gray.700"
                        color="white"
                        borderRadius="md"
                      >
                        <Skeleton isLoaded={!isPending}>
                          <HStack spacing={2}>
                            <FaCoins className="text-[#FFD700]" />
                            <Text className="truncate max-w-[50px]" fontWeight="medium">
                              {item.v5}
                            </Text>
                          </HStack>
                        </Skeleton>
                      </Tooltip>
                    </Td>

                    <Td>
                      <Tooltip label={`Claimed Rewards: ${item.v6.toString()}`}>
                        <Skeleton isLoaded={!isPending}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <IoCashOutline size={20} className="text-green-500" />
                            <Text className="truncate  max-w-[50px]">{item.v6}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>

                    <Td>
                      <Tooltip label={`Locked Rewards: ${item.v7.toString()}`}>
                        <Skeleton isLoaded={!isPending}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <IoLockClosedOutline size={20} className="text-gray-500" />
                            <Text className="truncate max-w-[50px]">{item.v7}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
                        {item.v11.map((ItemComponent, index3) => (
                          <ItemComponent
                            forceRerender={() => setKey((key) => key + 1)}
                            id={item.machineId}
                            key={index3}
                          />
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
