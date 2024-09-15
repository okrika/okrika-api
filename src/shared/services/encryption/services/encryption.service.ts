import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { pbkdf2, randomBytes } from "crypto";

@Injectable()
export class EncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  async hash(password: string): Promise<string> {
    if (!password) {
      throw new Error("Please provide a password to hash");
    }

    return new Promise((resolve, reject) => {
      const salt = randomBytes(20).toString("hex");

      pbkdf2(password, salt, 1000, 64, "sha512", (error, hash) => {
        if (error) {
          reject(error);
        }

        resolve(`${salt}.${hash.toString("base64")}`);
      });
    });
  }

  async compare(supplied: string, stored: string): Promise<boolean> {
    if (!stored || !supplied) {
      return false;
    }

    return new Promise((resolve, reject) => {
      const [salt, hash] = stored.split(".");

      pbkdf2(supplied, salt, 1000, 64, "sha512", (error, suppliedHash) => {
        if (error) {
          reject(error);
        }

        resolve(hash === suppliedHash.toString("base64"));
      });
    });
  }

  async sign(payload: string | object | Buffer, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload as any, options);
  }

  async verify(token: string, options?: JwtVerifyOptions) {
    return await this.jwtService.verifyAsync(token, options);
  }
}
