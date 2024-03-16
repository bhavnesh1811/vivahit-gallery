import React from "react";
import {
  Button,
  Flex,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import { showToast } from "../scripts/showToast";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const SignOut:React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const isMobile = useBreakpointValue({ base: true, sm: false });

  const handleSignOut = async () => {
    await signOut(auth).then(() => {
      showToast("Sign Out Successful", "Redirecting to Home", "success", toast);
      navigate("/");
    });
  };
  return (
    <Flex justifyContent={"flex-end"} alignItems={"center"} gap="8px">
      {!isMobile && <Text>{user?.email}</Text>}
      {user && <Button onClick={handleSignOut}>Sign Out</Button>}
    </Flex>
  );
};

export default SignOut;
