import { Provider } from "@nestjs/common";
import { v2 as cloud } from "cloudinary";
import { config } from "../../../../config";

export const MediaProvider: Provider = {
  provide: "Cloudinary",
  useFactory: () => {
    return cloud.config({
      cloud_name: config.media.name,
      api_key: config.media.key,
      api_secret: config.media.secret
    });
  }
};
