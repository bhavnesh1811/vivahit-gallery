import { Box } from "@chakra-ui/react";
import React from "react";
import GalleryUpload from "../components/GalleryUpload";

function Home(): React.ReactElement {
  return (
    <Box p="16px">
      <GalleryUpload />
    </Box>
  );
}

export default Home;
