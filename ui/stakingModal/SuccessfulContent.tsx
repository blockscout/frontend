/* eslint-disable */

import { Box, Flex, Grid, Text } from '@chakra-ui/react';


const SuccessfulContent = ({
    text
}: {
    text: string;
}) => {
    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%" height="auto"
        >
            <img 
                src="/static/check-badge.svg"
                draggable="false"
                width="100px"
                height="100px"
            />
            <h2 style={{
                color: '#000',
                fontFamily: 'HarmonyOS Sans',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '32px',
            }}> { text } </h2>
        </Flex>
    );
}

export default SuccessfulContent;
