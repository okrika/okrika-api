import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import {
  ThrottlerGuard as Guard,
  ThrottlerModuleOptions,
  ThrottlerStorageService
} from "@nestjs/throttler";
import { Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

@Injectable()
export class ThrottlerGuard extends Guard {
  protected errorMessage: string;
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorageService,
    reflector: Reflector
  ) {
    super(options, storageService, reflector);
    this.errorMessage = "Too Many Requests, please try again later.";
  }

  getRequestResponse(context: ExecutionContext): {
    req: any;
    res: any;
  } {
    try {
      const GraphQLContext = GqlExecutionContext.create(context).getContext();

      const req = GraphQLContext?.req || context?.switchToHttp()?.getRequest();

      const res = GraphQLContext?.res || context?.switchToHttp()?.getResponse();

      return { req, res };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

export const ThrottlerProvider: Provider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard
};
