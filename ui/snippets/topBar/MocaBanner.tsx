/* eslint-disable */
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';


const boxStyle = {
    // background: var(--decorative-pink-2, #FFA3F4);  
    background: '#FFA3F4',
}

const btnStyle = {
    color: '#FFF',
    fontFamily: 'Outfit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    lineHeight: 'normal',
    backgroundColor: '#000',
    width: '4.562rem',
    height: '1.625rem',
}
    


const textStyle = {
    // color: var(--text-primary, #002536);
    // font-family: Outfit;
    // font-size: 0.875rem;
    // font-style: normal;
    // font-weight: 600;
    // line-height: normal;
    color: '#002536',
    fontFamily: 'Outfit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
};

const MocaBanner = () => {
    return ( null 
        // <Box 
        //     display="flex"
        //     alignItems="center"
        //     justifyContent="center"
        //     height="40px"
        //     width="100%"
        //     style={boxStyle}
        //     paddingX={'2rem'}
        // >
        //     <Flex 
        //         width="100%"
        //         maxWidth="1200px"
        //         justifyContent="center"
        //         alignItems="center"
        //         gap="1rem"
        //     >
        //         <Text 
        //             textAlign="center"
        //             style={textStyle}
        //         >
        //            This is a beta version for developer testing. All data is temporary and for testing only
        //         </Text>

        //         <button style={btnStyle}
        //             onClick={() => {
        //                 // Handle dismiss action
        //                 console.log('Banner dismissed');
        //             }}
        //         >
        //             Dismiss
        //         </button>
        //     </Flex>
        // </Box>
    );
}

export default MocaBanner;