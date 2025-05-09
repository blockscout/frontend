/* eslint-disable */
import { Flex, Text, Box } from '@chakra-ui/react';


const HeadsUpInfo = ({
    label,
    value,
}: {
    label: string | number | React.ReactNode;
    value: string | number | React.ReactNode;
}) => {
    return (
        <Box
            width="100%"
            height="auto"
            padding="16px"
            borderRadius="16px"
            border="1px solid rgba(0, 46, 51, 0.10)"
            backgroundColor="#fff"
        >
            <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                gap="8px"
            >
                <Text
                    fontSize="14px"
                    fontWeight="500"
                    width="100%"
                    textAlign={"left"}
                    color="#000"
                    fontStyle="normal"
                    lineHeight="140%"
                    fontFamily="HarmonyOS Sans"
                >
                    { label}
                </Text>
                <Text
                    fontSize="12px"
                    fontWeight="500"
                    width="100%"
                    textAlign={"left"}
                    color="rgba(0, 0, 0, 0.60)"
                    fontStyle="normal"
                    lineHeight="140%"
                    fontFamily="HarmonyOS Sans"
                >
                    { value }
                </Text>
            </Flex>
        </Box>
    );
}

export default HeadsUpInfo;

