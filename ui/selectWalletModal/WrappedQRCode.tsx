import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';
import QRCode from 'react-qr-code';

const WSvg = chakra('svg');

export const WrappedQRCode = ({ value }: { value: string}) => {
  return (
    <Flex>
      <Flex
        // height: 276px;
        // padding: 10px;
        // position: relative;
        // width: 276px
        height="276px"
        padding="10px"
        position="relative"
        width="276px"
        color="gray.700"
        bg="white"
        borderRadius={ 9 }
      >
        <WSvg
          position="absolute"
          zIndex="0"
          left="0"
          top="0"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 8C0 3.58172 3.58172 0 8 0H33.1875C33.4982 0 33.75 0.25184 33.75 0.5625V0.5625C33.75 0.87316 33.4982
			1.125 33.1875 1.125H8.125C4.25901 1.125 1.125 4.25901 1.125 8.125V33.1875C1.125 33.4982 0.87316 33.75 0.5625
			33.75V33.75C0.25184 33.75 0 33.4982 0 33.1875V8Z"
            fill="currentColor"
          />
        </WSvg>
        <WSvg
          position="absolute"
          zIndex="0"
          left="0"
          bottom="0"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99976 34C3.58148 34 -0.000244141 30.4183 -0.000244141 26L-0.000244141 0.812637C-0.000244141 0.501901 0.251657
			0.25 0.562393 0.25V0.25C0.873129 0.25 1.12503 0.501901 1.12503 0.812637L1.12503 25.875C1.12503 29.741 4.25904 32.875
			8.12503 32.875L33.1876 32.875C33.4983 32.875 33.7501 33.1268 33.7501 33.4375V33.4375C33.7501 33.7482 33.4983 34
			33.1876 34L7.99976 34Z"
            fill="currentColor"
          />
        </WSvg>
        <WSvg
          position="absolute"
          zIndex="0"
          right="0"
          top="0"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.9988 6.10352e-05C30.4171 6.10352e-05 33.9988 3.58178 33.9988 8.00006L33.9988 33.1881C33.9988 33.4985 33.7472
			33.7501 33.4368 33.7501V33.7501C33.1265 33.7501 32.8749 33.4985 32.8749 33.1881L32.8749 8.12499C32.8749 4.259 29.7409
			1.12499 25.8749 1.12499L0.812275 1.12499C0.501634 1.12499 0.249809 0.873168 0.249809 0.562527V0.562527C0.249809
			0.251886 0.501632 6.10352e-05 0.812273 6.10352e-05L25.9988 6.10352e-05Z"
            fill="currentColor"
          />
        </WSvg>
        <WSvg
          position="absolute"
          zIndex="0"
          right="0"
          bottom="0"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.812552 34C0.501893 34 0.250053 33.7482 0.250053 33.4375V33.4375C0.250053 33.1268 0.501889 32.875 0.812548
			32.875L25.8751 32.875C29.7411 32.875 32.8751 29.741 32.8751 25.875L32.8751 0.811895C32.8751 0.501538 33.1267
			0.249944 33.4371 0.249944V0.249944C33.7474 0.249944 33.999 0.501538 33.999 0.811895L33.999 26C33.999 30.4182
			30.4173 34 25.999 34L0.812552 34Z"
            fill="currentColor"
          />
        </WSvg>
        <QRCode
          value={ value }
        />
      </Flex>
    </Flex>
  );
};
