/* eslint-disable */
import React, { useEffect } from 'react';
import ValidatorInfoBox from 'ui/validators/ValidatorInfoBox';
import ValidatorBox from 'ui/validators/ValidatorBox';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import IconSvg from 'ui/shared/IconSvg';
import { Avatar } from '@chakra-ui/react';
import PageTitle from 'ui/shared/Page/PageTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import axios from 'axios';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';
import { Flex, Box, Tooltip } from '@chakra-ui/react';
import { IconButton, useClipboard,} from '@chakra-ui/react';


const getShortValidatorName = (name: string) => {
    if (!name) return '';
    const maxLength = 20; // 设置最大长度
    if (name.length <= maxLength) {
        return name;
    }
    return name.slice(0, maxLength) + '...';
}

const copyIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="5.05566" y="5.44446" width="7" height="7" rx="0.583333" stroke="#FF57B7" strokeWidth="1.12" strokeLinejoin="round"/>
        <path d="M8.94434 5.44442V2.91665C8.94434 2.59448 8.68317 2.33331 8.361 2.33331H2.52767C2.2055 2.33331 1.94434 2.59448 1.94434 2.91665V8.74998C1.94434 9.07215 2.2055 9.33331 2.52767 9.33331H5.05545" stroke="#FF57B7" strokeWidth="1.12" strokeLinejoin="round"/>
    </svg>
)

const checkedMarkIcon = (
    <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1495" 
        width="14" height="14" 
    >   
        <path 
            d="M414.165333 609.834667L810.666667 213.333333l60.330666 60.330667L414.165333 730.496 170.666667 486.997333 230.997333 426.666667z" p-id="1496"
            fill="#FF57B7">
        </path>
    </svg>
)

type OverViewInfoType = {
    totalStake: string;
    commissionRate?: string;
    validatorStake?: string;
    uptime: string;
    blocksValidated: string;
    validatorRewards ?: string;
    liveApr?: string;
    validator?: string;
    status?: string;
    delegatorRewards?: string;
}


type ValidatorQueryParams = {
  /** 验证者状态过滤，支持数字或字符串类型 */
  status?: number | 'active' | 'inactive' | 'unbonding';
  /** 分页键，用于获取下一页数据 */
  nextKey?: string; // 默认值 '0x00'
  page?: number; // 默认值 1
  /** 每页返回的验证者数量 */
  limit?: number; // 默认值 10
  /** 是否返回总记录数 */
  countTotal?: boolean; // 默认值 true
  /** 是否按投票权重倒序排列 */
  reverse?: boolean; // 默认值 true
};

const ValidatorDetails = () => {

    const router = useRouter();
    const addr = getQueryParamString(router.query.addr);
    const { serverUrl : url } = useStakeLoginContextValue();

    const [ validatorName , setValidatorName ] = React.useState('');

    const [ isDetailInfoLoading, setIsDetailInfoLoading ] = React.useState(false);
    const [ isDelegatorsInfoLoading, setIsDelegatorsInfoLoading ] = React.useState(false);

    const [ overViewInfo , setOverViewInfo ] = React.useState({} as OverViewInfoType);

    const { hasCopied, onCopy } = useClipboard(addr, 1000);
    const [ copied, setCopied ] = React.useState(false);
    
    useEffect(() => {
    if (hasCopied) {
        setCopied(true);
    } else {
        setCopied(false);
    }
    }, [ hasCopied ]);

    const requestBasicDetailInfo = React.useCallback(async( _addr : string) => {
        try {
            setIsDetailInfoLoading(true);
            // const res = await (await fetch(url + '/api/network/validators/details/' + _addr, { method: 'get' })).json() as any
            const res = await axios.get(url + '/api/network/validators/details/' + _addr, { 
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                return null;
            });
            setIsDetailInfoLoading(false);
            if(res && res.code === 200) {
                const {
                    validator,
                    status,
                    totalStake,
                    commissionRate,
                    validatorStake,
                    uptime,
                    blocksValidated,
                    liveApr,
                    validatorRewards,
                    validatorName,
                    delegatorRewards
                } = res.data;
                setValidatorName(validatorName);
                setOverViewInfo({
                    validator: validator,
                    status: status,
                    totalStake: totalStake,
                    commissionRate: commissionRate,
                    validatorStake: validatorStake,
                    uptime: uptime,
                    validatorRewards: validatorRewards,
                    blocksValidated: blocksValidated,
                    liveApr: liveApr,
                    delegatorRewards: delegatorRewards,
                });
                const uploadProperties = res.uploadProperties;
            }
        }
        catch (error: any) {
            setIsDetailInfoLoading(false);
            throw Error(error);
        }
    }
    , [ url, addr]);



    useEffect(() => {
        if (!!addr) {
            requestBasicDetailInfo(addr);
        }
    }, [ addr, requestBasicDetailInfo]);

    const routerFallback = () => () => {
        router.back();
    };
    

    return (
        <div>
            <Flex align="center" marginBottom="24px">
                <Box
                    as ="span"
                    _hover ={{ cursor: 'pointer' , backgroundColor: 'rgba(0, 0, 0, 0.07)' }}
                    display="flex"
                    alignItems="center"
                    borderRadius={"4px"}
                    paddingLeft={"2px"}
                    justifyContent="center"
                    width="auto"
                    height="auto"
                    marginRight="8px"
                    onClick={ routerFallback() }
                >
                    <IconSvg cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
                </Box>
                <PageTitle marginBottom="0" title="Validator Detail" withTextAd/>
            </Flex>
            <Tooltip
                isDisabled={ true }
                label={ addr || ''}
                padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                    <Flex 
                        alignItems="center"
                        justifyContent={{ base: 'flex-start', md: 'space-between' }}
                        direction={{ base: 'column', md: 'row' }}
                        marginBottom="20px"
                        marginTop="24px"
                    >
                        <Text
                            as="span"
                            alignItems="center"
                            justifyContent={{ base: 'flex-start', md: 'center' } }
                            width={{ base: '100%', md: 'auto' }}
                            height="auto"
                        >
                            <Flex
                                flexDirection="row"
                                justifyContent= {{ base: 'flex-start', md: 'center' } }
                                alignItems="center"
                                width= {{ base: '100%', md: 'auto' }}
                                height="auto"
                                gap="8px"
                            >
                                <img
                                    src="/static/moca-brand.svg"
                                    width="32px"
                                    height="32px"
                                    style={{ borderRadius: '50%', marginRight: "4px" }}
                                />
                                <Text 
                                    fontSize="20px"
                                    fontWeight="700"
                                    textAlign={"left"}
                                    color="rgba(0, 0, 0)"
                                    fontStyle="normal"
                                    fontFamily="HarmonyOS Sans"
                                    lineHeight="normal"
                                    textTransform="capitalize"
                                    userSelect="none"
                                    as ="span"
                                > { getShortValidatorName(validatorName) } </Text>
                            </Flex>
                        </Text>
                        <Text
                            color="rgba(0, 0, 0, 0.60)"
                            fontSize="16px"
                            display="inline"
                            fontWeight="500"
                            lineHeight="normal"
                            fontStyle="normal"
                            as={'span'}
                            textTransform="capitalize"
                        >
                            { addr}
                            <Tooltip label= { copied ? 'Copied' : 'Copy' } placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                <IconButton
                                    aria-label="copy"
                                    icon={ copied ? checkedMarkIcon : copyIcon }
                                    variant="link"
                                    colorScheme="blackAlpha"
                                    size="xs"
                                    marginLeft="8px"
                                    onClick={ (event) => {
                                        event.stopPropagation();
                                        onCopy();
                                        setCopied(true);
                                    } }
                                />
                            </Tooltip>
                        </Text>
                    </Flex>
            </Tooltip>
            <ValidatorInfoBox overViewInfo={ overViewInfo } isDetailInfoLoading={ isDetailInfoLoading } />
            <ValidatorBox address={ addr } />
        </div>
    );
}

export default ValidatorDetails;