import { Logger, Module } from "@nestjs/common";
import { NotificationService } from "./services/notification.service";
import { NotificationResolver } from "./resolvers/notification.resolver";
import { SharedModule } from "src/shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationModel } from "./models/notification.model";

@Module({
  exports: [NotificationService],
  providers: [Logger, NotificationResolver, NotificationService],
  imports: [SharedModule, MongooseModule.forFeature([NotificationModel])]
})
export class NotificationModule {}
