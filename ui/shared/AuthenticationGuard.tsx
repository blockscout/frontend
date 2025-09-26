import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { toaster } from "toolkit/chakra/toaster";
interface AuthenticationGuardProps {
  children?: React.ReactNode;
}
const AuthenticationGuard = ({ children = null }: AuthenticationGuardProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null); // null = checking
  const [isInitialized, setIsInitialized] = React.useState(false);
  // Check authentication status on mount
  React.useEffect(() => {
    const checkAuth = () => {
      const authCookie = Cookies.get("SIMPLE_AUTH_TOKEN");
      setIsLoggedIn(Boolean(authCookie));
      setIsInitialized(true);
    };
    // Small delay to prevent flash
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);
  const handleLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Get credentials from environment variables
      const envEmail =
        process.env.NEXT_PUBLIC_LOGIN_EMAIL || "admin@blockscout.com";
      const envPasswordHash =
        process.env.NEXT_PUBLIC_LOGIN_PASSWORD_HASH ||
        CryptoJS.SHA256("admin123").toString(); // Default hash for 'admin123'
      // Hash the entered password
      const enteredPasswordHash = CryptoJS.SHA256(password).toString();
      // Check credentials
      if (email === envEmail && enteredPasswordHash === envPasswordHash) {
        // Generate a simple auth token
        const authToken = CryptoJS.SHA256(email + Date.now()).toString();
        // Set auth cookie and store email
        Cookies.set("SIMPLE_AUTH_TOKEN", authToken, {
          expires: 1, // 1 day
        });
        Cookies.set("SIMPLE_AUTH_EMAIL", email, {
          expires: 1, // 1 day
        });
        setIsLoggedIn(true);
        setEmail(""); // Clear form
        setPassword(""); // Clear form
        toaster.create({
          title: "Welcome to Blockscout! 🎉",
          description: `Successfully signed in as ${email}`,
          type: "success",
        });
      } else {
        toaster.create({
          title: "Authentication Failed",
          description:
            "Invalid email or password. Please check your credentials and try again.",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: "Login Error",
        description:
          "An unexpected error occurred during authentication. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      if (
        email !== "admin@blockscout.com" ||
        CryptoJS.SHA256(password).toString() !==
          CryptoJS.SHA256("admin123").toString()
      ) {
        setPassword(""); // Clear password on failed login for security
      }
    }
  }, [email, password]);
  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && email && password && !isLoading) {
        handleLogin();
      }
    },
    [email, password, isLoading, handleLogin]
  );
  // Show loading spinner while checking auth
  if (!isInitialized) {
    return (
      <Center minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
        <VStack gap={4}>
          <Spinner size="lg" color="blue.500" />
          <Text color="text.secondary">Loading...</Text>
        </VStack>
      </Center>
    );
  }
  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        _dark={{ bg: "gray.900" }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9999}
        overflow="auto"
      >
        <Center minH="100vh" p={4}>
          <Box
            maxW="400px"
            w="full"
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="xl"
            border="1px"
            borderColor="gray.200"
            _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          >
            <VStack gap={6} align="stretch">
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                  Welcome to McKinsey L1 Chain Explorer
                </Text>
                <Text color="text.secondary" fontSize="sm">
                  Please sign in to access the blockchain explorer
                </Text>
              </Box>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="medium">
                    Email Address
                  </Text>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    bg="white"
                    _dark={{ bg: "gray.700" }}
                    size="lg"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="medium">
                    Password
                  </Text>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    bg="white"
                    _dark={{ bg: "gray.700" }}
                    size="lg"
                  />
                </Box>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleLogin}
                  loading={isLoading}
                  loadingText="Signing in..."
                  disabled={!email || !password || isLoading}
                  w="full"
                >
                  Sign In
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Center>
      </Box>
    );
  }
  // User is authenticated, show the main application
  return <>{children}</>;
};
export default AuthenticationGuard;
