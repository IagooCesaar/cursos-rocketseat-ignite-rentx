import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

interface IUploadConfig {
  storage: multer.StorageEngine;
}

export default {
  upload(folder: string): IUploadConfig {
    const destination = resolve(__dirname, "..", "..", folder);

    return {
      storage: multer.diskStorage({
        destination,
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;
          return callback(null, fileName);
        },
      }),
    };
  },
};
