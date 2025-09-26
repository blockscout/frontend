import { VStack, Code, Flex, Box, Text, Center } from "@chakra-ui/react";

import mixpanel from "mixpanel-browser";
import type { ChangeEvent } from "react";

import { useRouter } from "next/router";
import React from "react";

import config from "configs/app";
import * as cookies from "lib/cookies";
import useFeatureValue from "lib/growthbook/useFeatureValue";
import useGradualIncrement from "lib/hooks/useGradualIncrement";
import { useRollbar } from "lib/rollbar";
import { Alert } from "toolkit/chakra/alert";
import { Button } from "toolkit/chakra/button";
import { Textarea } from "toolkit/chakra/textarea";
import { toaster } from "toolkit/chakra/toaster";
import AuthModal from "ui/snippets/auth/AuthModal";
import PageTitle from "ui/shared/Page/PageTitle";
const Login = () => {
  const router = useRouter();
  const rollbar = useRollbar();
  const [num, setNum] = useGradualIncrement(0);
  const testFeature = useFeatureValue("test_value", "fallback");
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isFormVisible, setFormVisibility] = React.useState(false);
  const [token, setToken] = React.useState("");
  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    setFormVisibility(Boolean(!token && config.features.account.isEnabled));
    // Show auth modal if account feature is enabled
    if (config.features.account.isEnabled && !token) {
      setShowAuthModal(true);
    }
  }, []);
  const handleAuthSuccess = React.useCallback(
    (isSuccess?: boolean) => {
      if (isSuccess) {
        // Redirect to home page after successful login
        router.push("/");
      } else {
        setShowAuthModal(false);
      }
    },
    [router]
  );
  const checkRollbar = React.useCallback(() => {
    rollbar?.error("Test error", { payload: "foo" });
  }, [rollbar]);
  const checkMixpanel = React.useCallback(() => {
    mixpanel.track("Test event", { my_prop: "foo bar" });
  }, []);
  const handleTokenChange = React.useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setToken(event.target.value);
    },
    []
  );
  const handleSetTokenClick = React.useCallback(() => {
    cookies.set(cookies.NAMES.API_TOKEN, token);
    setToken("");
    toaster.create({
      title: "Success 🥳",
      description: "Successfully set cookie",
      type: "success",
      onStatusChange: (details) => {
        if (details.status === "unmounted") {
          setFormVisibility(false);
        }
      },
    });
  }, [token]);
  const handleNumIncrement = React.useCallback(() => {
    for (let index = 0; index < 5; index++) {
      setNum(5);
    }
  }, [setNum]);
  const handleShowLogin = React.useCallback(() => {
    setShowAuthModal(true);
  }, []);
  // If account feature is enabled, show the proper login interface
  if (config.features.account.isEnabled) {
    return (
      <>
        <Center minH="60vh">
          <VStack gap={6} alignItems="center" textAlign="center">
            <PageTitle title="Sign In" />
            <Text fontSize="lg" color="text.secondary" maxW="400px">
              Choose your preferred method to sign in to your Blockscout account
            </Text>
            <Button size="lg" onClick={handleShowLogin} colorScheme="blue">
              Sign In
            </Button>
          </VStack>
        </Center>
        {showAuthModal && (
          <AuthModal
            initialScreen={{ type: "select_method" }}
            onClose={handleAuthSuccess}
          />
        )}
      </>
    );
  }
  // Fallback to development login for when account feature is not enabled
  return (
    <VStack gap={4} alignItems="flex-start" maxW="1000px">
      <PageTitle title="Login page" />
      <Alert status="info" title="Account Feature Not Enabled" inline={false}>
        <Text mb={2}>
          To enable proper authentication, you need to set up environment
          variables:
        </Text>
        <VStack align="start" gap={1}>
          <Code>NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED=true</Code>
          <Code>NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY=your_recaptcha_key</Code>
        </VStack>
      </Alert>
      {isFormVisible && (
        <>
          <Alert status="warning" title="Development Workaround" inline={false}>
            To Sign in go to production instance first, sign in there, copy
            obtained API token from cookie
            <Code ml={1}>{cookies.NAMES.API_TOKEN}</Code> and paste it in the
            form below.
          </Alert>
          <Textarea
            value={token}
            onChange={handleTokenChange}
            placeholder="API token"
          />
          <Button onClick={handleSetTokenClick}>Set cookie</Button>
        </>
      )}
      <Flex columnGap={2}>
        <Button colorScheme="red" onClick={checkRollbar}>
          Check Rollbar
        </Button>
        <Button colorScheme="teal" onClick={checkMixpanel}>
          Check Mixpanel
        </Button>
      </Flex>
      <Flex columnGap={2} alignItems="center">
        <Box w="50px" textAlign="center">
          {num}
        </Box>
        <Button onClick={handleNumIncrement} size="sm">
          add
        </Button>
      </Flex>
      <Box>
        Test feature value:{" "}
        <b>
          {testFeature.isLoading
            ? "loading..."
            : JSON.stringify(testFeature.value)}
        </b>
      </Box>
    </VStack>
  );
};
export default Login;
