/* eslint-disable */
import React, { createContext, useContext } from 'react';


const initialState = {
    isAuthenticated: false,
    isPendingSignature: false,
    token: '',
    address: '',
    nonce: '',
    loginFunction: async (address: string, token: string) => {},
    logoutFunction: async () => {},
    tokenPrice: 0,
    serverUrl: 'https://devzk-staking.bitkinetic.com',
    setTokenPrice: (price: number) => {},
};

const AppContext = createContext<any>(initialState);

export function StakeLoginContextProvider(props: any) {
    const { children } = props;
    const [ isAuthenticated, setIsAuthenticated ] = React.useState(false);
    const [ isPendingSignature, setIsPendingSignature ] = React.useState(false);
    const [ token, setToken ] = React.useState(initialState.token);
    const [ address, setAddress ] = React.useState(initialState.address);
    const [ tokenPrice, setTokenPrice ] = React.useState("0")
    const [ serverUrl, setServerUrl ] = React.useState('https://devzk-staking.bitkinetic.com');


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
