import React, { useState, useEffect } from "react";
import { Flex, Input, Button, useToast, Progress } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../configs/firebase";
import { v4 as uuidv4 } from "uuid";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { showToast } from "../scripts/showToast";
import { FileData } from "../interfaces/interface";
import Sizes from "./Sizes";
import { calculateSize, isImageOrVideo } from "../scripts/script";
import Gallery from "./Gallery";

const GalleryUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const [data, setData] = useState<FileData[]>([]);
  const [value, setValue] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);
  const [allFilesSize, setAllFilesSize] = useState<string>("");
  const [imageFilesSize, setImageFilesSize] = useState<string>("");
  const [videoFilesSize, setVideoFilesSize] = useState<string>("");
  const [user] = useAuthState(auth);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const getData = async () => {
    if (user) {
      let res = await getDoc(doc(db, "gallery", user?.uid));
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

  const handleUpload = async () => {
    try {
      if (!file) {
        showToast("Error", "Please select a file to upload.", "error", toast);
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
      const uploadData = uploadBytesResumable(storageRef, file);
      uploadData.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log(progress);
            
          setUploadStatus(progress !== 100 ? true : false);
          setValue(progress !== 100 ? snapshot.bytesTransferred : 0);
          // <Progress hasStripe value={snapshot.bytesTransferred} />
        },
        (error) => {
          //error
        },
        () => {
          getDownloadURL(uploadData.snapshot.ref).then(async (download) => {
            // console.log(download);
            data.fileUrl = download;
            if (user?.uid)
              await updateDoc(doc(db, "gallery", user?.uid), {
                gallery: arrayUnion(data),
              });
            showToast(
              "Success",
              "File uploaded successfully!",
              "success",
              toast
            );
          });
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Error", "Failed to upload file.", "error", toast);
    }
  };

  return (
    <>
      <Sizes
        allFilesSize={allFilesSize}
        imageFilesSize={imageFilesSize}
        videoFilesSize={videoFilesSize}
      />
      <Flex gap="16px" flexWrap={"wrap"} my="16px">
        <Flex direction={"column"} gap="16px">
          {uploadStatus ? (
            <Progress hasStripe value={value} isIndeterminate />
          ) : (
            <>
              <Input type="file" onChange={handleFileChange} />
              <Button onClick={handleUpload}>Upload</Button>
            </>
          )}
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
