import { IFileStorageService } from "./fileStorage.interface";
import cloudinary from "./cloudinary";
import { UpdateApiOptions, UploadApiResponse } from "cloudinary";
import path from "path";

class FileStorageService implements IFileStorageService {
  private rootFolder = "kesmondsTrainingApp";
  async saveFile(
    file: File,
    filename: string,
    folder?: string,
    option?: Pick<UploadApiResponse, "resource_type">,
  ): Promise<string> {
    try {
      const bufferArray = await file.arrayBuffer();
      const fileBuffer = Buffer.from(bufferArray);
      const result = await new Promise<UploadApiResponse | undefined>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: path.resolve(this.rootFolder, folder ?? ""),
                public_id: filename,
                ...option,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            )
            .end(fileBuffer);
        },
      );

      return Promise.resolve(result?.secure_url || "");
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw new Error("Failed to upload file");
    }
  }

  async deleteFile(filename: string): Promise<void> {
    // Implementation for deleting file
    return Promise.resolve();
  }
}

const fileStorageService = new FileStorageService();
export default fileStorageService;
