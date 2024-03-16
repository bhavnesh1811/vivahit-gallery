import React from "react";
import { FileData } from "../interfaces/interface";
import { Box, Image } from "@chakra-ui/react";

interface GalleryProps {
  file: FileData;
}

const Gallery: React.FC<GalleryProps> = ({ file }) => {
  const fileType = file.type.split("/")[0];
  
  return (
    <Box
      borderRadius={"12px"}
      p="4px"
      boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
    >
      {fileType === "image" ? (
        <Image width={200} src={file.fileUrl} alt="image" />
      ) : fileType === "video" ? (
        <Box width={200}>
          <video controls style={{ width: "100%" }}>
            <source src={file.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      ) : null}
    </Box>
  );
};

export default Gallery;
