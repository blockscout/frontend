/* eslint-disable */
import React, { createContext, useContext } from 'react';

const _URL = 'https://devzk-staking.bitkinetic.com';

const initialState = {
    isAuthenticated: false,
    isPendingSignature: false,
    token: '',
    address: '',
    nonce: '',
    loginFunction: async (address: string, token: string) => {},
    logoutFunction: async () => {},
    tokenPrice: "1.00",
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
