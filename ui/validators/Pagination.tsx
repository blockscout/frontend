/* eslint-disable */

"use client";
import React from 'react';
import { Box , Flex, Text } from '@chakra-ui/react';

const prev_icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.2329 11.8159C10.4626 11.577 10.4551 11.1972 10.2163 10.9675L7.06605 8L10.2163 5.0325C10.4551 4.80282 10.4626 4.423 10.2329 4.18413C10.0032 3.94527 9.62339 3.93782 9.38452 4.1675L5.78452 7.5675C5.66688 7.68062 5.60039 7.83679 5.60039 8C5.60039 8.16321 5.66688 8.31938 5.78452 8.4325L9.38452 11.8325C9.62339 12.0622 10.0032 12.0547 10.2329 11.8159Z" fill="black"/>
    </svg>
);

const next_icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.76711 11.8159C5.53743 11.577 5.54488 11.1972 5.78374 10.9675L8.93395 8L5.78374 5.0325C5.54488 4.80282 5.53743 4.423 5.76711 4.18413C5.99679 3.94527 6.37661 3.93782 6.61548 4.1675L10.2155 7.5675C10.3331 7.68062 10.3996 7.83679 10.3996 8C10.3996 8.16321 10.3331 8.31938 10.2155 8.4325L6.61548 11.8325C6.37661 12.0622 5.99679 12.0547 5.76711 11.8159Z" fill="black"/>
    </svg>
);

const App  = ({
    totalCount = 0,
    currentPage = 1,
    onJumpPrevPage,
    onJumpNextPage,
    isPrevDisabled = false,
    isNextDisabled = false,
}: {
    totalCount: number | string;
    currentPage: number | string;
    onJumpPrevPage: () => void;
    onJumpNextPage: () => void;
    isPrevDisabled?: boolean;
    isNextDisabled?: boolean;
}) => (
    <Flex width="100%" height="auto" justifyContent="flex-end" alignItems="center" marginTop="16px" gap="8px">
        <Box
            width="24px"
            height="24px"
            borderRadius="4px"
            backgroundColor="transparent"
            opacity={isPrevDisabled ? 0.4 : 1}
            cursor= { isPrevDisabled ? "not-allowed" : "pointer"}
            _hover={{ backgroundColor: '#F9F9F9' }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => {
                onJumpPrevPage();
            }}
        >
            {prev_icon}
        </Box>
        <Box
            width="24px"
            height="24px"
            borderRadius="4px"
            backgroundColor="#FEF1F9"
            _hover={{ backgroundColor: '#FEF1F9' , opacity: 0.7 }}
            display="flex"
            fontSize="12px"
            color = "#A80C53"
            border ="0.5px solid #FFCBEC"
            lineHeight="normal"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"

        >
            { currentPage }
        </Box>
        <Box
            width="24px"
            height="24px"
            borderRadius="4px"
            backgroundColor="transparent"
            _hover={{ backgroundColor: '#F9F9F9' }}
            cursor= { isNextDisabled ? "not-allowed" : "pointer"}
            display="flex"
            justifyContent="center"
            opacity={ isNextDisabled ? 0.4 : 1}
            alignItems="center"
            onClick={() => {
                onJumpNextPage();
            }}
        >
            {next_icon}
        </Box>
    </Flex>
);
export default App;