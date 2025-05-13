/* eslint-disable */
import React, { createContext, useContext } from 'react';


const initialState = {
    isAuthenticated: false,
    isPendingSignature: false,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhiZTg0Y2E5ZGFhMGVmNTJjMTZkODY4MmYyNDMzMTZlZWMzN2NkNjFjIiwiaWF0IjoxNzQ3MDM2MTQ0LCJleHAiOjE3NDc2NDA5NDR9.feFXMtIC_Lrn7jxkXPei8uaz6DgO1_WBA6jbTarkE_Q',
    address: '0xbe84ca9daa0ef52c16d8682f243316eec37cd61c',
    nonce: '0ad026c95f20b5dd7d35aa6d9751e9f3',
    loginFunction: async (address: string, token: string) => {},
    logoutFunction: async () => {},
};

const AppContext = createContext<any>(initialState);

export function StakeLoginContextProvider(props: any) {
    const { children } = props;
    const [ isAuthenticated, setIsAuthenticated ] = React.useState(false);
    const [ isPendingSignature, setIsPendingSignature ] = React.useState(false);
    const [ token, setToken ] = React.useState(initialState.token);
    const [ address, setAddress ] = React.useState(initialState.address);
    const [ nonce, setNonce ] = React.useState(initialState.nonce);

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
        nonce,
        setNonce,
        loginFunction,
        logoutFunction,
    }), [
      isAuthenticated, isPendingSignature, token, address, nonce
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
