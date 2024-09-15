import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Otp, OtpRepository } from "../models/otp.model";
import { createHash } from "crypto";
import { Invalid_OTP_Method_Message } from "../../authentication/messages/authentication.message";
import { AuthResponse } from "../../authentication/responses/authentication.response";
import { parse } from "platform";
//   import { MailService } from 'src/shared/services/mail/services/mail.service';
//   import { MailTemplate } from 'src/shared/services/mail/interfaces/mail.interface';

@Injectable()
export class OtpService {
  constructor(
    //   private readonly mailService: MailService,
    @InjectModel(Otp.name) private readonly otpRepository: OtpRepository
  ) {}

  async generate(identifier: string) {
    try {
      const code = Math.floor(10000 + Math.random() * 90000).toString();

      const hash = createHash("sha256").update(code).digest("hex");

      const existingOtp = await this.otpRepository.findOne({ identifier });

      if (existingOtp) {
        existingOtp.hash = hash;

        await existingOtp.save();
      } else {
        const otp = await this.otpRepository.create({ identifier, hash });

        await otp.save();
      }

      return code;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateOtp(identifier: string, context: any) {
    try {
      const device = parse(context.req.headers?.["user-agent"]);

      const agent = `${device.name || ""} ${device.os.version || ""} device`;

      const code = await this.generate(identifier);

      const params = { code, agent, name: "User" };

      // await this.mailService.send({
      //   params,
      //   to: identifier,
      //   template: MailTemplate.Forgotten,
      //   subject: `Hello, you requested for an OTP`
      // });

      return new AuthResponse(!!params, "Successfully generated OTP!");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async verifyOtp(code: string): Promise<string> {
    try {
      const hash = createHash("sha256").update(code).digest("hex");

      const otp = await this.otpRepository.findOne({ hash });

      if (!otp) {
        throw new ConflictException(Invalid_OTP_Method_Message);
      }

      await otp.deleteOne();

      return otp.identifier;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
