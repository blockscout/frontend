/* eslint-disable */
import ValidatorInfoBox from 'ui/validators/ValidatorInfoBox';
import ValidatorBox from 'ui/validators/ValidatorBox';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import getQueryParamString from 'lib/router/getQueryParamString';

const  ValidatorDetails = () => {

    const router = useRouter();
    const addr = getQueryParamString(router.query.addr);
    const url = "http://192.168.0.97:8080";

    const [ isDetailInfoLoading, setIsDetailInfoLoading ] = React.useState(false);
    const [ isDelegatorsInfoLoading, setIsDelegatorsInfoLoading ] = React.useState(false);

    const [ delegatorsTablePage, setDelegatorsTablePage ] = React.useState(1);
    const [ delegatorsTableNextPage, setDelegatorsTableNextPage ] = React.useState(0);

    const [ overViewInfo , setOverViewInfo ] = React.useState({});

    const requestBasicDetailInfo = React.useCallback(async( _addr : string) => {
        try {
            setIsDetailInfoLoading(true);
            const res = await (await fetch(url + '/api/network/validators/details/' + _addr, { method: 'get' })).json() as any
            setIsDetailInfoLoading(false);
            if(res && res.code === 200) {
                const { validator, status, totalStake, commissionRate, validatorStake, uptime, blocksValidated, liveApr } = res.data;
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

    const requestDelegatorsInfo = React.useCallback(async( _addr : string) => {
        try {
            setIsDelegatorsInfoLoading(true);
            const res = await (await fetch(url + '/api/network/validators/delegations/' + _addr, { method: 'get' })).json() as any
            setIsDelegatorsInfoLoading(false);
            if(res && res.code === 200) {
                console.log(res.data);
            }
        }
        catch (error: any) {
            setIsDelegatorsInfoLoading(false);
            throw Error(error);
        }
    }
    , [ url, addr]);
    

    useEffect(() => {
        if (!!addr) {
            requestBasicDetailInfo(addr);
            requestDelegatorsInfo(addr);
        }
    }, [ addr, requestBasicDetailInfo, requestDelegatorsInfo]);


    return (
        <div>
            <Text
                fontSize="2xl"
                fontWeight="bold"
                marginBottom="4"
            >
                { addr}
            </Text>
            <ValidatorInfoBox overViewInfo={ overViewInfo } isDetailInfoLoading={ isDetailInfoLoading } />
            <ValidatorBox />
        </div>
    );
}

export default ValidatorDetails;