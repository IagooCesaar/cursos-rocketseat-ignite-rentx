import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime";
import path from "path";

import upload from "@config/upload";
import { deleteFile } from "@utils/file";

import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = path.resolve(upload.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalName);

    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: "public-read",
        Body: fileContent,
        ContentType: mime.getType(originalName),
      })
      .promise();

    await deleteFile(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export { S3StorageProvider };
