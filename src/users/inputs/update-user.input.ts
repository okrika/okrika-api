import { InputType, PartialType, OmitType, Field } from "@nestjs/graphql";
import { CreateUserInput } from "../../authentication/inputs/create-user.input";
import { FileInput } from "src/shared/services/media/inputs/file.input";

@InputType()
export class UpdateUserInput extends OmitType(PartialType(CreateUserInput), [
  "type",
  "referredBy"
]) {
  @Field(() => Boolean, { nullable: true })
  shouldRemoveAvatar?: boolean;

  @Field(() => FileInput, { nullable: true })
  avatarInput?: FileInput;
}
