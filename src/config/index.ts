import * as dotenv from "dotenv";

dotenv.config();

const isTesting = process.env.NODE_ENV === "test";

const isDevelopment = process.env.NODE_ENV === "development" || isTesting;

const isProduction = !isDevelopment;

export const config = {
  isProduction,
  isDevelopment,
  port: process.env.PORT,
  database: {
    uri: process.env.DATABASE_URL
  },
  tokenization: {
    secret: process.env.JWT_SECRET
  },
  notifications: {
    apiKey: "",
    appId: ""
  },
  media: {
    name: "",
    key: "",
    secret: ""
  }
};
