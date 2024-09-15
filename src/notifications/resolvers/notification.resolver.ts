import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationService } from "../services/notification.service";
import { NotificationsResponse } from "../responses/notifications.response";
import { CurrentUser } from "src/authentication/decorators/current-user.decorator";
import { User } from "src/users/models/user.model";
import { FilterInput } from "src/shared/services/pagination/inputs/filter.input";
import { AuthResponse } from "src/authentication/responses/authentication.response";
import { Types } from "mongoose";
import GraphQLObjectId from "graphql-type-object-id";

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => NotificationsResponse)
  async getUserNotifications(
    @CurrentUser() user: User,
    @Args({
      name: "filter",
      type: () => FilterInput
    })
    filter: FilterInput
  ) {
    return await this.notificationService.getUserNotifications(filter, user);
  }

  @Mutation(() => AuthResponse)
  async markNotificationAsRead(
    @CurrentUser() user: User,
    @Args({ name: "id", type: () => GraphQLObjectId })
    id: Types.ObjectId
  ) {
    return await this.notificationService.markNotificationAsRead(id, user);
  }

  @Mutation(() => AuthResponse)
  async markAllAsRead(
    @CurrentUser() user: User,
    @Args({ name: "input", type: () => FilterInput })
    input: FilterInput
  ) {
    return await this.notificationService.markAllAsRead(input, user);
  }
}
