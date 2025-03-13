import { useAccount, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json'; // ERC-1155 NFT 合约 ABI

const NFT_CONTRACT_ADDRESS = '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1'; // NFT 合约地址

export function useGetBalance(amount: any) {
  const { address, isConnected } = useAccount(); // 获取用户钱包地址

  // 读取 NFT 余额 (getBalance)
  const { data, isLoading, error, refetch } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: 'getBalance',
    args: address && amount ? [address, amount] : undefined,
    query: {
      enabled: !!address && !!amount,
    },
  });

  return {
    nftData: data as any, // NFT 余额数据
    isLoadingBalance: isLoading, // 读取余额的加载状态
    balanceError: error, // 读取余额的错误
    refetch, // 手动刷新余额
  };
}
