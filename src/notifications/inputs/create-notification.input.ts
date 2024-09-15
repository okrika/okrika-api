import { Field, InputType } from "@nestjs/graphql";
import GraphQLObjectId from "graphql-type-object-id/dist";
import { Types } from "mongoose";
import {
  NotificationStatus,
  NotificationType
} from "../interfaces/notification.interface";
import { IsOptional } from "class-validator";
import { IsObjectId } from "src/shared/validators/objectid.validator";

@InputType()
export class CreateNotificationInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;

  @Field(() => GraphQLObjectId)
  @IsObjectId()
  receiver: Types.ObjectId;

  @Field(() => GraphQLObjectId, { nullable: true })
  @IsObjectId()
  @IsOptional()
  review?: Types.ObjectId;

  @Field(() => GraphQLObjectId, { nullable: true })
  @IsObjectId()
  @IsOptional()
  product?: Types.ObjectId;

  @Field(() => GraphQLObjectId, { nullable: true })
  @IsObjectId()
  @IsOptional()
  sender?: Types.ObjectId;

  @Field({ nullable: true })
  @IsOptional()
  link?: string;

  @Field({ nullable: true })
  @IsOptional()
  icon?: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => NotificationStatus)
  status: NotificationStatus;
}
