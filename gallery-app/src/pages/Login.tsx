import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../scripts/showToast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../configs/firebase";
import { AuthContext } from "../context/AuthContextProvider";

function Login(): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const values = useContext(AuthContext);

  useEffect(() => {
    if (values.user) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  const formdata = {
    email: useRef<HTMLInputElement | null>(null),
    password: useRef<HTMLInputElement | null>(null),
  };

  const handleLogin = (e: React.FormEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const email = formdata.email.current?.value || "";
    const password = formdata.password.current?.value || "";
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          if (userCredential.user) {
            showToast(
              "Log in Successful",
              "Redirecting to Home",
              "success",
              toast
            );
            navigate("/");
          }
        })
        .catch((error: FirebaseError) => {
          showToast(error.code, error.message, "error", toast);
        });
    }
  };

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={6} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack as="form" onSubmit={handleLogin} spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={formdata.email} name="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  ref={formdata.password}
                  name="password"
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Login
              </Button>
            </Stack>
            <Flex justifyContent={"center"} gap="8px">
              <Text align={"center"}>Not a user? </Text>
              <Link to={"/signup"}>
                <Text color={"blue.400"}>Signup</Text>
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
