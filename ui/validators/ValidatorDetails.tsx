/* eslint-disable */
import React, { useEffect } from 'react';
import ValidatorInfoBox from 'ui/validators/ValidatorInfoBox';
import ValidatorBox from 'ui/validators/ValidatorBox';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import { formatPubKey } from 'ui/storage/utils';
import { Flex, Box, Tooltip } from '@chakra-ui/react';


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
    const url = "http://192.168.0.97:8080";

    const [ isDetailInfoLoading, setIsDetailInfoLoading ] = React.useState(false);
    const [ isDelegatorsInfoLoading, setIsDelegatorsInfoLoading ] = React.useState(false);

    const [ overViewInfo , setOverViewInfo ] = React.useState({} as OverViewInfoType);
    
    

    const requestBasicDetailInfo = React.useCallback(async( _addr : string) => {
        try {
            setIsDetailInfoLoading(true);
            const res = await (await fetch(url + '/api/network/validators/details/' + _addr, { method: 'get' })).json() as any
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
                    validatorRewards
                } = res.data;
                setOverViewInfo({
                    validator: validator,
                    status: status,
                    totalStake: totalStake,
                    commissionRate: commissionRate,
                    validatorStake: validatorStake,
                    uptime: uptime,
                    blocksValidated: blocksValidated,
                    liveApr: liveApr
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
                <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
                <PageTitle marginBottom="0" title="Validator Detail" withTextAd/>
            </Flex>
            <Tooltip
                isDisabled={ true }
                label={ "hidehiier" } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                    <Flex 
                        alignItems="center"
                        justifyContent={{ base: 'flex-start', md: 'space-between' }}
                        direction={{ base: 'column', md: 'row' }}
                        padding="16px"
                    >
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            marginBottom="4"
                            as ="span"
                        >
                            <span></span>
                        </Text>
                        <Text
                            marginBottom="4"
                            color="rgba(0, 0, 0, 0.60)"
                            fontSize="16px"
                            display="inline"
                            lineHeight="16px"
                            fontStyle="normal"
                            as={'span'}
                            textTransform="capitalize"
                        >
                            { addr}
                        </Text>
                    </Flex>
            </Tooltip>
            <ValidatorInfoBox overViewInfo={ overViewInfo } isDetailInfoLoading={ isDetailInfoLoading } />
            <ValidatorBox address={ addr } />
        </div>
    );
}

export default ValidatorDetails;