/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function useUnisatWallet() {
  const [ address, setAddress ] = useState<string>("");
  const toast = useToast();
  useEffect(() => {
    if ((window as any)?.unisat) {
      (window as any).unisat.on(
        "accountsChanged",
        (accounts: Array<string>) => setAddress(accounts[0]));
    }
  }, []);

  const unisatHandler = async() => {
    try {
      const accounts = await (window as any).unisat.requestAccounts();
      if (accounts[0].substring(0, 3) === "bc1") {
        localStorage.setItem('address', accounts[0]);
        setAddress(accounts[0]);
      } else {
        toast({
          description:
            "Please Connect to Native Segwit Address starts with bc1...",
          status: "error",
        });
      }
    } catch (e) {
      toast({
        description:
          "Something went wrong while connecting to wallet, please try again later",
        status: "error",
      });
    }
  };
  const switchUnisatNetwork = async() => {
    try {
      // eslint-disable-next-line no-unused-vars
      await (window as any).unisat.switchNetwork("livenet");
      await unisatHandler();
    } catch (e) {}
  };

  const connect = async() => {
    if ((window as any).unisat) {
      try {
        const res = await (window as any).unisat.getNetwork();
        if (res === "livenet") {
          await unisatHandler();
        } else {
          await switchUnisatNetwork();
        }
      } catch (e) {
        toast({
          description: (e as any),
          status: "error",
        });
      }
    } else {
      window.open("https://unisat.io/download", "_blank");
    }
  };
  return {
    address,
    connect,
  };
}
