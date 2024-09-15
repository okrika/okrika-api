import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Types } from "mongoose";
import { AddBankInformationInput } from "../inputs/add-bank-information.input";
import { Wallet, WalletRepository } from "../models/wallet.model";

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletRepository: WalletRepository
  ) {}

  async createWallet(user: Types.ObjectId, session: ClientSession) {
    try {
      return await this.walletRepository.create([{ user }], { session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addBankInformation(
    input: AddBankInformationInput,
    user: Types.ObjectId
  ) {
    try {
      const wallet = await this.walletRepository.findByUser(user);

      if (!wallet) {
        throw new NotFoundException("This User Wallet does not exist");
      }

      Object.entries(input).forEach(([key, value]) => {
        if (key in Wallet) {
          wallet[key] = value;
        }
      });

      return await wallet.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getWallet(user?: Types.ObjectId, id?: Types.ObjectId) {
    try {
      let wallet: Wallet;

      if (!user && !id) {
        throw new BadRequestException("Please provide user or wallet ID");
      }

      if (user) {
        wallet = await this.walletRepository.findByUser(user);
      } else if (id) {
        wallet = await this.walletRepository.findById(id);
      }

      if (!wallet) {
        throw new NotFoundException("This Wallet does not exist");
      }

      return await wallet.populate(["user"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
