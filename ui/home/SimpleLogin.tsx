import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import config from "configs/app";
import * as cookies from "lib/cookies";
import { toaster } from "toolkit/chakra/toaster";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "toolkit/chakra/dialog";
const SimpleLogin = () => {
  const router = useRouter();
  const { open, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  // Check if user is already logged in
  React.useEffect(() => {
    const authCookie = Cookies.get("SIMPLE_AUTH_TOKEN");
    const storedEmail =
      Cookies.get("SIMPLE_AUTH_EMAIL") || "admin@blockscout.com";
    setIsLoggedIn(Boolean(authCookie));
    setUserEmail(storedEmail);
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
        setUserEmail(email);
        onClose();
        toaster.create({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${email}!`,
          type: "success",
        });
        // Optional: redirect to a specific page
        // router.push('/account/dashboard');
      } else {
        toaster.create({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setPassword(""); // Clear password for security
    }
  }, [email, password, onClose, router]);
  const handleLogout = React.useCallback(() => {
    Cookies.remove("SIMPLE_AUTH_TOKEN");
    Cookies.remove("SIMPLE_AUTH_EMAIL");
    setIsLoggedIn(false);
    setUserEmail("");
    setEmail("");
    setPassword("");
    toaster.create({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      type: "info",
    });
    // Refresh the page to show login modal
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);
  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && email && password) {
        handleLogin();
      }
    },
    [email, password, handleLogin]
  );
  if (isLoggedIn) {
    return (
      <Box
        maxW="320px"
        p={4}
        borderWidth={1}
        borderRadius="md"
        bg="white"
        shadow="sm"
        _dark={{ bg: "gray.800" }}
      >
        <VStack gap={3} align="stretch">
          <Text fontWeight="bold" fontSize="md">
            Welcome Back! 👋
          </Text>
          <Text fontSize="sm" color="text.secondary">
            You are signed in as:{" "}
            <Text as="span" fontWeight="medium">
              {userEmail}
            </Text>
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            colorScheme="red"
          >
            Sign Out
          </Button>
        </VStack>
      </Box>
    );
  }
  return (
    <>
      <DialogRoot
        open={open}
        onOpenChange={({ open }) => !open && onClose()}
        size="md"
      >
        <DialogContent>
          <DialogHeader>Sign In to Blockscout</DialogHeader>
          <DialogBody pb={6}>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" mb={2} fontWeight="medium">
                  Email
                </Text>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                />
              </Box>
              <Button
                colorScheme="blue"
                onClick={handleLogin}
                loading={isLoading}
                loadingText="Signing in..."
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
export default SimpleLogin;
