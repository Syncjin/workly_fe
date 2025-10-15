export interface FileRequest {
    files: File[];
}
export interface FileDownloadRequest {
    fileId: string;
}

export type FileDeleteRequest = FileDownloadRequest;
