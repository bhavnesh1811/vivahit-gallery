import React from "react";
import {
  Avatar,
  Button,
  Flex,
  HStack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignOut from "./SignOut";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      justifyContent={"space-between"}
    >
      <Link to="/">
        <Avatar
          size="lg"
          src="https://play-lh.googleusercontent.com/00O55jNA2nyUFzkxIALUiqY9zlnbF8SLU3NzibAjyGkGg7vpyWS8ZrIsPDXhCkpBCa4=w240-h480-rw"
          name="logo"
        />
      </Link>

      <HStack
        spacing={{ base: "2", md: "6" }}
        marginInline={isMobile ? "" : "16px"}
      >
        <SignOut />
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <FaMoon /> : <FaSun />}
        </Button>
      </HStack>
    </Flex>
  );
};

export default Navbar;
