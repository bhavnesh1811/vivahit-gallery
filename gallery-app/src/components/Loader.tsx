import React from "react";
import { Flex, Image, useColorMode } from "@chakra-ui/react";

const Loader: React.FC = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      top={"60px"}
      bg={colorMode === "dark" ? "#1A202C" : "white"}
      justify={"center"}
      alignItems={"center"}
      w={"100%"}
      position={"fixed"}
      h={"100%"}
      zIndex={10}
    >
      <Image
        w={"100px"}
        src={"https://i.giphy.com/media/xelHBioIJDyoSqu0z1/giphy.webp"}
      />
    </Flex>
  );
};

export default Loader;
