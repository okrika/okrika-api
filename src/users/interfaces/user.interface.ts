import { registerEnumType } from "@nestjs/graphql";

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserOTP {
  otp: string;
  expiresAt: number;
}

export enum UserType {
  User = "User",
  Seller = "Seller",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin"
}

registerEnumType(UserType, {
  name: "UserType",
  description: "User Account Types"
});
