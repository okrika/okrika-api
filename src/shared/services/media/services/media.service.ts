import { Injectable } from "@nestjs/common";
import {
  AdminAndResourceOptions,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloud
} from "cloudinary";
import * as streamifier from "streamifier";

@Injectable()
export class MediaService {
  async uploadFile(
    buffer: Buffer,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    options.timeout = 4000;

    if (options.overwrite === undefined) {
      options.overwrite = true;
    }

    return new Promise((resolve, reject) => {
      const upload = cloud.uploader.upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });

      streamifier.createReadStream(buffer).pipe(upload);
    });
  }

  async getFile(id: string, options?: AdminAndResourceOptions): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await cloud.api.resource(id, options, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  async deleteFile(
    path: string,
    options?: { resource_type?: string; type?: string; invalidate?: boolean }
  ): Promise<{ result: "ok" }> {
    return new Promise(async (resolve, reject) => {
      cloud.uploader.destroy(path, options, (error, result) => {
        if (error) {
          return reject(error);
        }

        result.ok = true;

        return resolve(result);
      });
    });
  }

  async deleteByFolder(
    path: string,
    options?: AdminAndResourceOptions
  ): Promise<{ ok: boolean; result?: Record<string, string> }> {
    return new Promise(async (resolve, reject) => {
      try {
        cloud.api.delete_resources_by_prefix(path, options, error => {
          if (error) {
            return reject(error);
          }

          cloud.api.delete_folder(path, options, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve({ ok: true, result });
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}
