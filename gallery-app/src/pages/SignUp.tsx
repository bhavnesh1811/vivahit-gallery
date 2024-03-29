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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../configs/firebase";
import { showToast } from "../scripts/showToast";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContextProvider";

function Signup(): React.ReactElement {
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
    name: useRef<HTMLInputElement | null>(null),
  };

  const handleSignUp = (e: React.FormEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const email = formdata.email.current?.value || "";
    const password = formdata.password.current?.value || "";
    const name = formdata.name.current?.value || "";

    if (email && password && name) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          if (userCredential.user) {
            showToast(
              "Sign up Successful",
              "Redirecting to Home",
              "success",
              toast
            );
            await setDoc(doc(db, "gallery", userCredential.user.uid), {
              gallery: [],
            });
            navigate("/");
          }
        })
        .catch((error: FirebaseError) => {
          showToast(error.code, error.message, "error", toast);
        });
    }
  };

  return (
    <Flex alignItems={"center"} justifyContent={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={6} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
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
          <Stack as="form" onSubmit={handleSignUp} spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" ref={formdata.name} name="name" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={formdata.email} name="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  ref={formdata.password}
                  name="password"
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
                Sign up
              </Button>
            </Stack>
            <Flex justifyContent={"center"} gap="8px">
              <Text align={"center"}>Already a user? </Text>
              <Link to={"/login"}>
                <Text color={"blue.400"}>Login</Text>
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Signup;
