import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  Input,
  useToast,
  CircularProgress,
  Icon,
  Text,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../configs/firebase";
import { MdAddAPhoto } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { showToast } from "../scripts/showToast";
import { FileData } from "../interfaces/interface";
import Sizes from "./Sizes";
import { calculateSize, isImageOrVideo } from "../scripts/script";
import Gallery from "./Gallery";
import { AuthContext } from "../context/AuthContextProvider";

const GalleryUpload: React.FC = () => {
  const toast = useToast();
  const [data, setData] = useState<FileData[]>([]);
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [allFilesSize, setAllFilesSize] = useState<string>("");
  const [imageFilesSize, setImageFilesSize] = useState<string>("");
  const [videoFilesSize, setVideoFilesSize] = useState<string>("");
  const values = useContext(AuthContext);

  const getData = async () => {
    if (values.user) {
      let res = await getDoc(doc(db, "gallery", values.user?.uid));
      let temp = res.data();
      if (temp) {
        setData(temp?.gallery);
        setAllFilesSize(calculateSize(temp.gallery).totalSize);
        setImageFilesSize(calculateSize(temp.gallery).totalImageSize);
        setVideoFilesSize(calculateSize(temp.gallery).totalVideoSize);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = null;
    if (event.target.files && event.target.files.length > 0) {
      file = event.target.files[0];
    }
    try {
      
      if (!file) {
        showToast("Error", "Please select a file to upload.", "error", toast);
        return;
      }
      if (file.size>30*1024*1024) {
        showToast("Error", "Please size should be less than 30mb", "error", toast);
        file=null;
        return;
      }
      if (!isImageOrVideo(file.type)) {
        showToast(
          "Error",
          "Please select a image/video file to upload.",
          "error",
          toast
        );
        return;
      }

      const uuid = uuidv4();
      const data = {
        name: `files/${uuid}`,
        size: file.size,
        type: file.type,
        fileUrl: "",
      };
      const storageRef = ref(storage, data.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadStatus(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
          showToast("Error", "Failed to upload file.", "error", toast);
          setUploadStatus(false);
          setUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (download) => {
            data.fileUrl = download;
            if (values?.user?.uid)
              await updateDoc(doc(db, "gallery", values?.user?.uid), {
                gallery: arrayUnion(data),
              });
            showToast(
              "Success",
              "File uploaded successfully!",
              "success",
              toast
            );
            setUploadStatus(false);
            setUploadProgress(0);
            file=null;
            getData();
          });
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Error", "Failed to upload file.", "error", toast);
      setUploadStatus(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Sizes
        allFilesSize={allFilesSize}
        imageFilesSize={imageFilesSize}
        videoFilesSize={videoFilesSize}
      />
      <Flex
        display={{ base: "grid", md: "flex" }}
        gap="16px"
        flexWrap="wrap"
        my="16px"
        direction={{ base: "column", md: "row" }}
        gridTemplateColumns={{ base: "repeat(1,1fr)", sm: "repeat(2,1fr)" }}
      >
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"12px"}
          p="4px"
          boxShadow={"rgba(0,0,0,0.5)0px 5px 15px"}
          width={{ base: "100%", md: "200px" }}
          height={"200px"}
        >
          <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
            <Flex direction={"column"} gap="16px">
              <Icon
                alignSelf={"center"}
                as={MdAddAPhoto}
                color="red"
                h={7}
                w={7}
              />
              {!uploadStatus && <Input
                id="fileUpload"
                onChange={handleUpload}
                style={{ display: "none" }}
                type="file"
                accept="image/*, video/*"
              />}
              <Text>
                {uploadStatus ? (
                  <CircularProgress value={uploadProgress} >
                    <CircularProgressLabel >
                      {uploadProgress.toFixed(0)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                ) : (
                  "Upload Image/Video"
                )}
              </Text>
            </Flex>
          </label>
        </Flex>
        {data &&
          data?.map((file: FileData) => (
            <Gallery key={file.name} file={file} />
          ))}
      </Flex>
    </>
  );
};

export default GalleryUpload;
