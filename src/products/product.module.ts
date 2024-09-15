import { Logger, Module } from "@nestjs/common";
import { ProductService } from "./services/product.service";
import { ProductResolver } from "./resolvers/product.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModel } from "./models/product.model";
import { UserModule } from "src/users/user.module";
import { FollowModule } from "src/follows/follow.module";
import { SharedModule } from "src/shared/shared.module";

@Module({
  providers: [Logger, ProductResolver, ProductService],
  imports: [
    UserModule,
    SharedModule,
    FollowModule,
    MongooseModule.forFeature([ProductModel])
  ]
})
export class ProductModule {}
