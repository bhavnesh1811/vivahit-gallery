import { FileData } from "../interfaces/interface";

export const calculateSize = (data: FileData[]) => {
    let totalSize = 0;
    let totalImageSize = 0;
    let totalVideoSize = 0;

    data.forEach((file) => {

        totalSize += file.size;
        if (file.type.startsWith("image/")) {
            totalImageSize += file.size;
        } else if (file.type.startsWith("video/")) {
            totalVideoSize += file.size;
        }
    });

    const formatSize = (size: number) => {
        if (size < 1024) {
            return size.toFixed(2) + " B";
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + " KB";
        } else if (size < 1024 * 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + " MB";
        } else {
            return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        }
    };

    return {
        totalSize: formatSize(totalSize),
        totalImageSize: formatSize(totalImageSize),
        totalVideoSize: formatSize(totalVideoSize),
    };
};

export const isImageOrVideo = (fileType: string): boolean => {
    return fileType.startsWith("image/") || fileType.startsWith("video/");
};
