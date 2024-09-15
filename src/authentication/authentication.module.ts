import { Module } from "@nestjs/common";
import { AuthenticationService } from "./services/authentication.service";
import { AuthenticationResolver } from "./resolvers/authentication.resolver";
import { OtpModule } from "src/otps/otp.module";
import { SharedModule } from "src/shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel } from "src/users/models/user.model";
import { WalletModule } from "src/wallets/wallet.module";
import { AuthenticationStrategy } from "./strategies/authentication.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  providers: [
    AuthenticationResolver,
    AuthenticationService,
    AuthenticationStrategy
  ],
  imports: [
    OtpModule,
    SharedModule,
    WalletModule,
    MongooseModule.forFeature([UserModel]),
    PassportModule.register({ defaultStrategy: "jwt" })
  ]
})
export class AuthenticationModule {}
