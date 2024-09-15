import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductRepository } from "../models/product.model";
import { CreateProductInput } from "../inputs/create-product.input";
import { User } from "src/users/models/user.model";
import { MediaService } from "src/shared/services/media/services/media.service";
import { FileInput } from "src/shared/inputs/file.input";
import { UploadResult } from "src/shared/services/media/interfaces/media.interface";
import { stringify } from "src/utilities/stringify-json";
import { customAlphabet } from "nanoid";
import { FilterQuery, Types } from "mongoose";
import { getCurrency } from "src/utilities/location";
import { omit } from "lodash";
import { UpdateProductInput } from "../inputs/update-product.input";
import { ProductsFilterInput } from "../inputs/products-filter.input";
import { UserService } from "src/users/services/user.service";
import { PaginationQuery } from "src/shared/services/pagination/interfaces/pagination.interface";
import { PaginationService } from "src/shared/services/pagination/services/pagination.service";
import { isMongoId } from "class-validator";
import { FollowService } from "src/follows/services/follow.service";

const uniqueId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);

@Injectable()
export class ProductService {
  constructor(
    private readonly loggerService: Logger,
    private readonly userService: UserService,
    private readonly mediaService: MediaService,
    private readonly followService: FollowService,
    private readonly paginationService: PaginationService,
    @InjectModel(Product.name)
    private readonly productRepository: ProductRepository
  ) {}

  async generateCode() {
    let code = "";

    let isUnique = false;

    while (!isUnique) {
      code = uniqueId();

      isUnique = !Boolean(await this.productRepository.exists({ code }));
    }

    return code;
  }

  async getProducts(input: ProductsFilterInput) {
    try {
      // let user: User;

      // if (token !== 'null') {
      //   user = await this.userService.getUserByToken(token);
      // }

      const query: PaginationQuery<Product> = {
        isDeleted: false,
        take: input?.take,
        page: input?.page,
        populate: ["vendor"],
        sort: { createdAt: -1 }
      };

      if (input?.keyword) {
        query.$and = [
          { isDeleted: false },
          {
            $or: ["name", "category", "description"].map(keyword => ({
              [keyword]: {
                $regex: new RegExp(input.keyword.split(" ").join("|"), "i")
              }
            }))
          }
        ];

        delete query.isDeleted;
      }

      // const productsResponse = await this.paginationService.paginate(
      //   this.productRepository,
      //   query,
      // );

      // productsResponse.list = await Promise.all(
      //   productsResponse.list.map(async (product) => {
      //     product.vendor.followerCount =
      //       await this.followService.getFollowerCount(product.vendor._id);

      //     if (user) {
      //       product.vendor.isFollowing = await this.followService.isFollowing(
      //         user._id,
      //         product.vendor._id,
      //       );
      //     }

      //     return product;
      //   }),
      // );

      return await this.paginationService.paginate(
        this.productRepository,
        query
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProduct(id: string) {
    try {
      // let user: User;

      // if (token !== 'null') {
      //   user = await this.userService.getUserByToken(token);
      // }

      const query: FilterQuery<Product> = { isDeleted: false };

      if (isMongoId(id)) {
        query._id = new Types.ObjectId(id);
      } else {
        query.code = id;
      }

      // const product = await this.productRepository.findOne(query, '', {
      //   populate: ['vendor'],
      // });

      // product.vendor.followerCount = await this.followService.getFollowerCount(
      //   product.vendor._id,
      // );

      // if (user) {
      //   product.vendor.isFollowing = await this.followService.isFollowing(
      //     user._id,
      //     product.vendor._id,
      //   );
      // }

      return await this.productRepository.findOne(query, "", {
        populate: ["vendor"]
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createProduct(input: CreateProductInput, user: User, context: any) {
    let productId: Types.ObjectId;

    try {
      input.vendor = user._id;

      input.code = await this.generateCode();

      if (!input.currency) {
        input.currency = getCurrency(context);
      }

      const [product] = await this.productRepository.create([
        omit(input, ["images"])
      ]);

      productId = product._id;

      product.images = await this.handleImages(product, [], input.images);

      return await product.save();
    } catch (error) {
      if (productId) {
        try {
          await this.mediaService.deleteByFolder(`products/${productId}`);
        } catch (error) {
          this.loggerService.log(
            stringify(error),
            "Product Failure Image Deletion"
          );
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  async handleImages(
    product: Product,
    storedImages: string[],
    inputImages: FileInput[]
  ) {
    try {
      let result: string[] = storedImages;

      let images = inputImages;

      if (result.length) {
        const inputImageNames = inputImages.map(image => image.fileName);

        const uploadResults = await Promise.allSettled(
          result.map(async (image, index) => {
            try {
              const fileName = image.split("/")[image.split("/").length - 1];

              if (!inputImageNames.includes(fileName)) {
                // image has been deleted

                images = images.filter(inputImage => inputImage.uri !== image);

                const { result } = await this.mediaService.deleteFile(
                  `products/${image
                    .split("products/")[1]
                    .substring(0, image.split("products/")[1].length - 4)}`
                );

                return { result, index };
              }

              if (inputImageNames.includes(fileName)) {
                //image wasn't deleted
                images = images.filter(inputImage => inputImage.uri !== image);

                return { result: "passed", index };
              }

              // a fall back, very less likely to happen
              return { result: "nothing here", index };
            } catch (error) {
              throw new InternalServerErrorException(error);
            }
          })
        );

        const filteredResults = uploadResults.filter((result, index) => {
          if (result.status === "rejected") {
            this.loggerService.error(
              `Product Image at index ${index} failed for the following reason - ${stringify(
                { error: result.reason }
              )}`,
              `Product Images Clean up`
            );

            return false;
          }

          return true;
        }) as PromiseFulfilledResult<UploadResult>[];

        const results = filteredResults.map(result => result.value);

        const deletedImages = results
          .filter(result => result.result === "ok")
          .map(({ index }) => index);

        if (deletedImages.length) {
          result = result.filter((_, index) => !deletedImages.includes(index));
        }

        if (results.some(result => result.result === "nothing here")) {
          this.loggerService.warn(
            `Investigate Product: ${
              product.id
            } and check images with indexes - ${results
              .filter(result => result.result === "nothing here")
              .map(result => result.index)
              .join()}`,
            `Product Images Investigation`
          );
        }
      }

      if (images.length) {
        const uploadedImages = await Promise.all(
          images.map(async image => {
            const response = await this.mediaService.uploadFile(
              Buffer.from(image.uri, "base64"),
              {
                resource_type: "image",
                folder: `products/${product.id}/images`
              }
            );

            return response.secure_url || response.url;
          })
        );

        result.push(...uploadedImages);
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProduct(input: UpdateProductInput, vendor: User) {
    try {
      const product = await this.productRepository.findOne({
        _id: input.id,
        isDeleted: false,
        vendor: vendor._id
      });

      if (!product) {
        throw new UnauthorizedException();
      }

      Object.entries(omit(input, ["id", "images"])).forEach(([key, value]) => {
        product[key] = value;
      });

      if (input?.images && input?.images?.length) {
        product.images = await this.handleImages(
          product,
          product.images,
          input.images
        );
      }

      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteEvent(id: Types.ObjectId, user: User) {
    try {
      const product = await this.productRepository.findOne({
        _id: id,
        vendor: user._id
      });

      if (!product) {
        throw new UnauthorizedException();
      }

      if (!product.isDeleted) {
        product.isDeleted = true;

        await product.save();
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
