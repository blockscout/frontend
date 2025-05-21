/* eslint-disable */

import { Box, Flex, Switch , Grid, Text } from '@chakra-ui/react';
import SearchInput from 'ui/validators/SearchInput';

const TableFilter = ({
  totalCount = 0,
  isActiveOnly,
  setIsActiveOnly,
  searchValue,
  setSearchValue,
}: {
  totalCount: number;
  isActiveOnly: boolean;
  setIsActiveOnly: (value: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}) => {
    return (
    <Box
        width="100%"
        height="auto"
        marginBottom={"16px"}
        paddingRight={{ base: '12px', lg: '0' }}
      >
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 320px' }} 
            gap={ "24px" }
            alignItems="center"
            marginBottom="16px"
          >
                <Flex
                  display={'flex' }
                  alignItems="center"
                  justifyContent= {{ base: 'space-between'  , lg:  'space-between' }}
                  >
                    <Box
                      width={{ base: 'auto', lg: 'auto' }}
                      height="auto"
                    >
                          <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                              height="42px"
                              border="solid 1px rgba(0, 46, 51, 0.10)"
                              padding = "0 16px"
                              gap="12px"
                              borderRadius={'9999px'}
                            >
                                <Text
                                  fontSize="12px"
                                  display="inline"
                                  lineHeight="16px"
                                  fontStyle="normal"
                                  userSelect={"none"}
                                  as={'span'}
                                  textTransform="capitalize"
                                  fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">All Validators</Text>
                                <Text
                                  fontSize="12px"
                                  display="inline"
                                  lineHeight="16px"
                                  fontStyle="normal"
                                  as={'span'}
                                  textTransform="capitalize"
                                  fontFamily="HarmonyOS Sans" fontWeight="500" color="#A80C53"> { totalCount } </Text>
                          </Box>
                    </Box>
                    <Box
                      width={{ base: 'auto', lg: 'auto' }}
                      height="auto"
                    >
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="auto"
                        height="auto"
                        gap="8px"
                        >
                            <Text
                                fontSize="12px"
                                display="inline"
                                lineHeight="16px"
                                fontStyle="normal"
                                as={'span'}
                                textTransform="capitalize"
                                userSelect={"none"}
                                fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">Active Validators Only</Text>
                            <Switch  colorScheme='pink' checked={ isActiveOnly } onChange={ (e) => setIsActiveOnly(e.target.checked) }/>
                        </Flex>
                    </Box>
                </Flex>
                <Box
                  width={{ base: '100%', lg: '320px' }}
                  height="auto"
                >
                    <SearchInput 
                        onChange={(searchTerm) => setSearchValue(searchTerm)}
                        initialValue={ searchValue }
                        placeholder="Search for Validators"
                        isLoading={ false }
                        type="text"
                        name="search"
                    />
                </Box>
          </Grid>
      </Box>
    )
}

export default TableFilter;

