import { Module } from "@nestjs/common";
import { OtpService } from "./services/otp.service";
import { OtpResolver } from "./resolvers/otp.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { OtpModel } from "./models/otp.model";

@Module({
  exports: [OtpService],
  providers: [OtpResolver, OtpService],
  imports: [MongooseModule.forFeature([OtpModel])]
})
export class OtpModule {}
