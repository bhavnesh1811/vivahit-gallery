export interface FileData {
    name: string;
    size: number;
    type: string;
    fileUrl: string;
}

export interface SizesProps {
    allFilesSize: string;
    videoFilesSize: string;
    imageFilesSize: string;
}