import { Field, InputType } from "@nestjs/graphql";
import { IsBase64, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class FileInput {
  @Field()
  @IsBase64()
  uri: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fileName?: string;
}
