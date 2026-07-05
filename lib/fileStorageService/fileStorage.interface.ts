export interface IFileStorageService {
  saveFile(file: File, filename: string): Promise<string>;
  deleteFile(filename: string): Promise<void>;
}
