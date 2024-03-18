import React, { useState, useEffect, useContext, ChangeEvent } from "react";
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
  const [file, setFile] = useState<File[]>([]);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    // console.log(selectedFiles);
    if (selectedFiles && selectedFiles.length) {
      setFile(Array.from(selectedFiles)); 
      handleUpload(Array.from(selectedFiles));
    } else {
      setFile([]);
    }
  };

  const handleUpload = async (file: File[]) => {
    try {
      let totalSize: number = 0;
      const uploadDataList: FileData[] = [];
      for (let i = 0; i < file.length; i++) {
        totalSize += file[i].size;
      }

      if (!file || file.length === 0) {
        showToast("Error", "Please select a file to upload.", "error", toast);
        return;
      }

      if (totalSize > 30 * 1024 * 1024) {
        showToast(
          "Error",
          "File size should be less than 30mb",
          "error",
          toast
        );
        setFile([]);
        return;
      }

      const uploadTasks = file.map((file: File) => {
        if (!isImageOrVideo(file.type)) {
          showToast(
            "Error",
            "Please select an image/video file to upload.",
            "error",
            toast
          );
          return null;
        }
        const uuid = uuidv4();
        const uploadData = {
          name: `files/${uuid}`,
          size: file.size,
          type: file.type,
          fileUrl: "",
        };
        uploadDataList.push(uploadData);
        const storageRef = ref(storage, uploadData.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return uploadTask;
      });

      setUploadStatus(true);

      const combinedUploadTask = uploadTasks.reduce(
        (combinedTask: any, task: any) => {
          if (task) {
            return onAllTasks(
              combinedTask,
              task,
              () => setUploadProgress(getCombinedProgress(uploadTasks)),
              (error) => handleUploadError(error)
            );
          }
          return combinedTask;
        },
        null
      );

      if (combinedUploadTask) {
        await combinedUploadTask;
        const fileUrls = await Promise.all(
          uploadDataList.map(async (uploadData) => {
            const downloadUrl = await getDownloadURL(
              ref(storage, uploadData.name)
            );
            return { ...uploadData, fileUrl: downloadUrl };
          })
        );

        if (values?.user?.uid) {
          await updateDoc(doc(db, "gallery", values?.user?.uid), {
            gallery: arrayUnion(...fileUrls),
          });
        }

        showToast("Success", "Files uploaded successfully!", "success", toast);
        setUploadStatus(false);
        setUploadProgress(0);
        setFile([]);
        getData();
      }
    } catch (error) {
      handleUploadError(error);
    }
  };

  const onAllTasks = (
    combinedTask: any | null,
    task: any,
    onProgress: () => void,
    onError: (error: any) => void
  ) => {
    if (!combinedTask) {
      return task;
    }

    const combinedSnapshot = {
      bytesTransferred: 0,
      totalBytes: 0,
      state: "running",
    };

    combinedTask.on(
      "state_changed",
      (snapshot: any) => {
        combinedSnapshot.bytesTransferred += snapshot.bytesTransferred;
        combinedSnapshot.totalBytes += snapshot.totalBytes;
        onProgress();
      },
      (error: any) => onError(error)
    );

    return combinedTask;
  };

  const getCombinedProgress = (tasks: any[]) => {
    const totalBytes = tasks.reduce(
      (total, task) => total + (task.snapshot?.totalBytes || 0),
      0
    );
    const bytesTransferred = tasks.reduce(
      (transferred, task) =>
        transferred + (task.snapshot?.bytesTransferred || 0),
      0
    );
    return (bytesTransferred / totalBytes) * 100;
  };

  const handleUploadError = (error: any) => {
    console.error("Error uploading file:", error);
    showToast("Error", "Failed to upload file.", "error", toast);
    setUploadStatus(false);
    setUploadProgress(0);
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
              {!uploadStatus && (
                <Input
                  id="fileUpload"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*, video/*"
                  multiple
                />
              )}
              <Text>
                {uploadStatus ? (
                  <CircularProgress value={uploadProgress}>
                    <CircularProgressLabel>
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
