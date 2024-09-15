import { InputType, Field } from "@nestjs/graphql";
import { IsByteLength, IsNumberString } from "class-validator";

@InputType()
export class AddBankInformationInput {
  @Field()
  bankName: string;

  @Field()
  @IsNumberString(undefined, { message: "Please provide a valid bank code" })
  bankCode: string;

  @Field()
  accountName: string;

  @Field()
  @IsNumberString()
  @IsByteLength(10, 10, { message: "Please provide a valid account number" })
  accountNumber: string;
}
