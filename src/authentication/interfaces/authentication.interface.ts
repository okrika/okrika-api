import { registerEnumType } from "@nestjs/graphql";

export enum SocialLoginType {
  Google = "Google"
}

registerEnumType(SocialLoginType, {
  name: "SocialLoginType",
  description: "Social Login Types"
});
