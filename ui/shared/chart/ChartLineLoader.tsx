import { useColorModeValue, useToken, chakra } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line max-len
const d = 'M2 87.8491C2 87.8491 33.0576 108.005 66.5621 87.8491C100.067 67.693 104.693 112.847 115.444 112.847C126.196 112.847 127.564 -14.2955 150.132 4.10661C172.701 22.5088 204.973 118.132 231.009 87.8491C257.044 57.5664 282.524 27.2837 300.355 57.5664C318.185 87.8491 419.225 111.026 439.651 57.5664C460.077 4.10661 479.504 244.505 516.708 244.505C553.911 244.505 560.47 122.168 589.929 144.014C619.388 165.861 604.48 198.172 633.774 198.172C663.068 198.172 704.562 89 704.562 89';
const INCREMENT = 3;

const ChartLineLoader = ({ className }: { className?: string }) => {
  const ref = React.useRef<SVGPathElement>(null);
  const raf = React.useRef<number>();
  const offset = React.useRef(0);

  const lineBgColor = useToken('colors', useColorModeValue('blackAlpha.200', 'whiteAlpha.200'));
  const lineFgColor = useToken('colors', useColorModeValue('blackAlpha.400', 'whiteAlpha.400'));
  const gradientStopColor = useToken('colors', useColorModeValue('whiteAlpha.200', 'blackAlpha.100'));

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
        <linearGradient id="chart_line_loader" x1="376.522" y1="-36.0708" x2="340.953" y2="235.952" gradientUnits="userSpaceOnUse">
          <stop offset="0.02" stopColor="#D9D9D9"/>
          <stop offset="0.78" stopColor={ gradientStopColor }/>
        </linearGradient>
      </defs>
      <path
        // eslint-disable-next-line max-len
        d="M0 84.457C0 84.457 26.9979 96.5169 40.8708 94.4593C57.73 91.9588 65.8502 80.4561 81.7417 80.4561C107.797 80.4561 95.6959 109.963 113.927 109.963C132.319 109.963 119.036 18.9419 144.581 0.937714C161.732 -11.1508 196.154 97.7378 216.615 91.9588C238.617 85.7448 273.895 26.7304 287.5 45C305 68.5 343.838 88 371 88C403.5 88 431.426 78.5463 444 50C453.061 29.4283 487.301 242.999 514.5 242.999C535.957 242.999 544.838 204.23 557.887 175.478C568.09 152.997 577.811 139.47 577.811 139.47C577.811 139.47 585.475 138.97 599.269 151.973C613.062 164.976 602.196 192.045 621.237 195.483C631.855 197.4 639.628 199.484 647.803 187.981C655.977 176.478 671.303 151.973 671.303 151.973L704 86.4575L702.467 234.992V271H0V84.457Z"
        fill="url(#chart_line_loader)"
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
        fill="none"
      />
    </svg>
  );
};

export default chakra(ChartLineLoader);
