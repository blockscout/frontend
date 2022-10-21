import { useBreakpointValue } from '@chakra-ui/react';

export default function useIsMobile(ssr = true) {
  return useBreakpointValue({ base: true, lg: false }, { ssr });
}
