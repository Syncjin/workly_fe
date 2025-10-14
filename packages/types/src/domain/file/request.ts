export interface FileRequest {
    files: File[];
}
export interface FileDownloadRequest {
    fileId: number;
}

export type FileDeleteRequest = FileDownloadRequest;
