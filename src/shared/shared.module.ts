import { Module } from "@nestjs/common";
import { EncryptionService } from "./services/encryption/services/encryption.service";
import { JwtModule } from "@nestjs/jwt";
import { config } from "src/config";
import { PaginationService } from "./services/pagination/services/pagination.service";
import { MediaService } from "./services/media/services/media.service";

@Module({
  exports: [MediaService, EncryptionService, PaginationService],
  providers: [MediaService, EncryptionService, PaginationService],
  imports: [JwtModule.register({ secret: config.tokenization.secret })]
})
export class SharedModule {}
