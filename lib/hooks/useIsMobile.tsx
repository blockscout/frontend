import { useBreakpointValue } from '@chakra-ui/react';

export default function useIsMobile() {
  return useBreakpointValue({ base: true, lg: false });
}
