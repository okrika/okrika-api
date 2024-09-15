import { PaginationResponse } from "../../shared/services/pagination/responses/pagination.response";
import { Field, ObjectType } from "@nestjs/graphql";
import { Notification } from "../models/notification.model";

@ObjectType()
export class NotificationsResponse extends PaginationResponse<Notification> {
  @Field(() => [Notification])
  list: Notification[];

  @Field(() => Number, { nullable: true })
  unReadCount?: number;
}
