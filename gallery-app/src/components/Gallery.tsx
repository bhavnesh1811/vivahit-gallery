import React from "react";
import { FileData } from "../interfaces/interface";
import { AspectRatio, Box, Image } from "@chakra-ui/react";

interface GalleryProps {
  file: FileData;
}

const Gallery: React.FC<GalleryProps> = ({ file }) => {
  const fileType = file.type.split("/")[0];

  return (
    <Box
      borderRadius={"12px"}
      boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
      position="relative"
    >
      {fileType === "image" ? (
        <Image
          width={{ base: "100%", md: "200px" }}
          h="200px"
          borderRadius={"12px"}
          src={file?.fileUrl}
          alt="image"
          _hover={{ transform: "50px" }}
        />
      ) : fileType === "video" ? (
        <AspectRatio borderRadius={"12px"} ratio={1} width={{ base: "100%", md: "200px" }}>
          <iframe title={file?.name} style={{borderRadius:"12px"}} src={file?.fileUrl} allowFullScreen />
        </AspectRatio>
      ) : null}
    </Box>
  );
};

export default Gallery;
