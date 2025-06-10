/* eslint-disable */
import React, { createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const _URL = 'https://devzk-staking.bitkinetic.com';

const defaultPrice = "1.00"; // Default price in case of failure to fetch

const initialState = {
    isAuthenticated: false,
    isPendingSignature: false,
    token: '',
    address: '',
    nonce: '',
    loginFunction: async (address: string, token: string) => {},
    logoutFunction: async () => {},
    tokenPrice: defaultPrice,
    serverUrl: _URL , 
    setTokenPrice: (price: number) => {},
};

const AppContext = createContext<any>(initialState);

export function StakeLoginContextProvider(props: any) {
    const { children } = props;
    const [ isAuthenticated, setIsAuthenticated ] = React.useState(false);
    const [ isPendingSignature, setIsPendingSignature ] = React.useState(false);
    const [ token, setToken ] = React.useState(initialState.token);
    const [ address, setAddress ] = React.useState(initialState.address);
    const [ tokenPrice, setTokenPrice ] = React.useState("1.00")
    const [ serverUrl, setServerUrl ] = React.useState(_URL);

    const fetchTokenPrice = async () => {
        await axios.get(_URL + '/api/network/overview-stats/mocaPrice',  {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        }).then((response) => {
            const r = response.data;
            if (r && r.code === 200) {
                const price = r.data.price;
                setTokenPrice(price);
            } else {
                return defaultPrice;
            }
        }).catch((error) => {
            return null;
        });
    }

    useEffect(() => {

        fetchTokenPrice(); // 初始化时先调一次
        const interval = setInterval(fetchTokenPrice, 60 * 1000); // 每30秒轮询
        return () => clearInterval(interval); // 清理定时器
        
    }, []);

    const loginFunction = async (address: string, token: string) => {
        setIsAuthenticated(true);
        setToken(token);
        setAddress(address);
    };

    const logoutFunction = async () => {
        setIsAuthenticated(false);
        setToken('');
        setAddress('');
    };

    const value = React.useMemo(() => ({
        isAuthenticated,
        setIsAuthenticated,
        isPendingSignature,
        setIsPendingSignature,
        token,
        address,
        setToken,
        setAddress,
        loginFunction,
        logoutFunction,
        tokenPrice,
        setTokenPrice,
        serverUrl,
    }), [
        isAuthenticated, isPendingSignature, token, address, tokenPrice,
    ]);
    return (
        <AppContext.Provider value={ value }>
          { children }
        </AppContext.Provider>
    );
}


export function useStakeLoginContextValue() {
  return useContext(AppContext);
}
