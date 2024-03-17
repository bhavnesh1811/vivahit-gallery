import { Box } from "@chakra-ui/react";
import React from "react";
import GalleryUpload from "../components/GalleryUpload";
import Navbar from "../components/Navbar";

function Home(): React.ReactElement {
  return (
    <>
      <Navbar />
      <Box p="16px">
        <GalleryUpload />
      </Box>
    </>
  );
}

export default Home;
