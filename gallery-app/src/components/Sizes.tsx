import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { SizesProps } from "../interfaces/interface";

const Sizes: React.FC<SizesProps> = ({
  allFilesSize,
  videoFilesSize,
  imageFilesSize,
}) => {
  return (
    <Flex
      justifyContent={{ md: "space-around" }}
      direction={{ base: "column", md: "row" }}
      gap={"16px"}
      h={{md:"150px"}}
    >
      <Flex
        flex={1}
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
        justifyContent={"center"}
        direction={"column"}
        background={"linear-gradient(to right, #44bdf9, #58b5b9)"}

      >
        <Text>Total Files Uploaded </Text>
        <Heading>
          {allFilesSize}
        </Heading>
      </Flex>
      <Flex
        flex={1}
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
        justifyContent={"center"}
        direction={"column"}
        background={"linear-gradient(to right, #44bdf9, #58b5b9)"}
      >
        <Text>Total Videos Uploaded </Text>
        <Heading>
          {videoFilesSize}
        </Heading>
      </Flex>
      <Flex
        flex={1}
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
        justifyContent={"center"}
        direction={"column"}
        background={"linear-gradient(to right, #44bdf9, #58b5b9)"}
      >
        <Text>Total Image Size </Text>
        <Heading>
          {imageFilesSize}
        </Heading>
      </Flex>
    </Flex>
  );
};

export default Sizes;
