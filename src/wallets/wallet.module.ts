import { Module } from "@nestjs/common";
import { WalletService } from "./services/wallet.service";
import { WalletResolver } from "./resolvers/wallet.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletModel } from "./models/wallet.model";

@Module({
  exports: [WalletService],
  providers: [WalletResolver, WalletService],
  imports: [MongooseModule.forFeature([WalletModel])]
})
export class WalletModule {}
