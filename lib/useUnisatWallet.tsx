/* eslint-disable quotes */
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function useUnisatWallet() {
  const [ address, setAddress ] = useState<string>("");
  const toast = useToast();
  useEffect(() => {
    window.unisat.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
    });
  }, []);

  const unisatHandler = async() => {
    try {
      const accounts = await window.unisat.requestAccounts();
      if (accounts[0].substring(0, 3) === "bc1") {
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
      await window?.unisat.switchNetwork("livenet");
      await unisatHandler();
    } catch (e) {}
  };

  const connect = async() => {
    if (window.unisat) {
      try {
        const res = await window.unisat.getNetwork();
        if (res === "livenet") {
          await unisatHandler();
        } else {
          await switchUnisatNetwork();
        }
      } catch (e) {
        toast({
          description: e,
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
