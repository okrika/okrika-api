import { Module } from "@nestjs/common";
import { FollowService } from "./services/follow.service";
import { FollowResolver } from "./resolvers/follow.resolver";
import { NotificationModule } from "src/notifications/notification.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel } from "src/users/models/user.model";
import { FollowModel } from "./models/follow.model";

@Module({
  exports: [FollowService],
  providers: [FollowResolver, FollowService],
  imports: [
    NotificationModule,
    MongooseModule.forFeature([UserModel, FollowModel])
  ]
})
export class FollowModule {}
