import { Module } from "@nestjs/common";
import { LikeService } from "./services/like.service";
import { LikeResolver } from "./resolvers/like.resolver";
import { NotificationModule } from "src/notifications/notification.module";
import { MongooseModule } from "@nestjs/mongoose";
import { LikeModel } from "./models/like.model";
import { ProductModel } from "src/products/models/product.model";

@Module({
  exports: [LikeService],
  providers: [LikeResolver, LikeService],
  imports: [
    NotificationModule,
    MongooseModule.forFeature([LikeModel, ProductModel])
  ]
})
export class LikeModule {}
