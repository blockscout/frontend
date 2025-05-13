import { useToken, chakra } from '@chakra-ui/react';
import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

// eslint-disable-next-line max-len
const d = 'M2 87.8491C2 87.8491 33.0576 108.005 66.5621 87.8491C100.067 67.693 104.693 112.847 115.444 112.847C126.196 112.847 127.564 -14.2956 150.132 4.10659C172.701 22.5087 204.973 118.132 231.009 87.8491C257.044 57.5664 282.524 27.2837 300.355 57.5664C318.185 87.8491 419.225 111.026 439.651 57.5664C460.077 4.10659 479.504 244.505 516.708 244.505C553.911 244.505 560.47 122.168 589.929 144.014C619.388 165.861 604.48 198.172 633.774 198.172C663.068 198.172 704.562 89 704.562 89';
const INCREMENT = 3;

const ChartLineLoader = ({ className }: { className?: string }) => {
  const ref = React.useRef<SVGPathElement>(null);
  const raf = React.useRef<number>();
  const offset = React.useRef(0);

  const [ lineBgColor ] = useToken('colors', useColorModeValue('gray.200', 'gray.500'));
  const [ lineFgColor ] = useToken('colors', useColorModeValue('gray.400', 'gray.300'));
  const [ gradientStopColor ] = useToken('colors', useColorModeValue('whiteAlpha.200', 'blackAlpha.100'));

  React.useEffect(() => {
    const length = ref.current?.getTotalLength() || 0;

    ref.current?.setAttribute('stroke-dasharray', `${ length },${ length }`);

    const animatePath = () => {
      ref.current?.setAttribute('stroke-dashoffset', `${ length - offset.current }`);
      const nextOffset = offset.current + INCREMENT <= length ? offset.current + INCREMENT : 0;

      offset.current = nextOffset;
      raf.current = window.requestAnimationFrame(animatePath);
    };
    raf.current = window.requestAnimationFrame(animatePath);

    return () => {
      raf.current && window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <svg className={ className } width="100%" viewBox="0 0 707 272" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chart_line_loader" x1="0" y1="0" x2="0" y2="272" gradientUnits="userSpaceOnUse">
          <stop offset="0.02" stopColor="#D9D9D9"/>
          <stop offset="0.78" stopColor={ gradientStopColor }/>
        </linearGradient>
      </defs>
      <path
        // eslint-disable-next-line max-len
        d="M2 87.8491C2 87.8491 33.0576 108.005 66.5621 87.8491C100.067 67.693 104.693 112.847 115.444 112.847C126.196 112.847 127.564 -14.2956 150.132 4.10659C172.701 22.5087 204.973 118.132 231.009 87.8491C257.044 57.5664 282.524 27.2837 300.355 57.5664C318.185 87.8491 419.225 111.026 439.651 57.5664C460.077 4.10659 479.504 244.505 516.708 244.505C553.911 244.505 560.47 122.168 589.929 144.014C619.388 165.861 604.48 198.172 633.774 198.172C663.068 198.172 704.562 89 704.562 83.4575L702.467 231.992V268H0V85.5Z"
        fill="url(#chart_line_loader)"
        transform="translate(0,2)"
      />
      <path
        d={ d }
        stroke={ lineBgColor }
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        ref={ ref }
        d={ d }
        stroke={ lineFgColor }
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="10000,100000"
        strokeDashoffset="-10000"
        fill="none"
      />
    </svg>
  );
};

export default chakra(ChartLineLoader);
