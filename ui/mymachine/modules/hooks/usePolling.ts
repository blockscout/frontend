import { useEffect } from 'react';

// 极简轮询 Hook
// callback: 需要轮询执行的函数
// intervalMs: 轮询间隔时间（毫秒）
export const usePolling = (callback: () => void, intervalMs: number) => {
  useEffect(() => {
    // 立即执行一次
    callback();

    // 设置轮询
    const intervalId = setInterval(callback, intervalMs);

    // 清理函数：组件卸载时清除轮询
    return () => clearInterval(intervalId);
  }, [callback, intervalMs]);
};
