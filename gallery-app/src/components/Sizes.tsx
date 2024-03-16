import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { SizesProps } from "../interfaces/interface";

const Sizes: React.FC<SizesProps> = ({
  allFilesSize,
  videoFilesSize,
  imageFilesSize,
}) => {
  return (
    <Flex justifyContent={{md:"space-around"}} direction={{base:"column",md:"row"}} gap={{base:"16px",md:"0px"}}>
      <Box
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
      >
        <Text>Total size : {allFilesSize}</Text>
      </Box>
      <Box
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
      >
        <Text>Total Video Size : {videoFilesSize}</Text>
      </Box>
      <Box
        boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
        p="8px 16px"
        borderRadius={"12px"}
      >
        <Text>Total Image Size : {imageFilesSize}</Text>
      </Box>
    </Flex>
  );
};

export default Sizes;
