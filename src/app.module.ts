import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./users/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "./config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { ThrottlerModule } from "@nestjs/throttler";
import { SharedModule } from "./shared/shared.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { WalletModule } from "./wallets/wallet.module";
import { OtpModule } from "./otps/otp.module";
import { LikeModule } from "./likes/like.module";
import { ProductModule } from "./products/product.module";
import { NotificationModule } from "./notifications/notification.module";
import { FollowModule } from "./follows/follow.module";

export const GraphQLModules = [
  OtpModule,
  LikeModule,
  UserModule,
  WalletModule,
  FollowModule,
  SharedModule,
  ProductModule,
  NotificationModule,
  AuthenticationModule
];

const ServerModules = [
  MongooseModule.forRoot(config.database.uri),
  GraphQLModule.forRoot({
    cors: {
      credentials: true,
      origin: true
    },
    debug: true,
    playground: true,
    autoSchemaFile: true,
    driver: ApolloDriver,
    include: GraphQLModules,
    fieldResolverEnhancers: ["guards"],
    context: ({ req, res }) => ({ req, res })
  }),
  ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 10 }] })
];

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [...ServerModules, ...GraphQLModules]
})
export class AppModule {}
