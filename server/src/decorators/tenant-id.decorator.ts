import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantIdFromAccessToken = createParamDecorator((data: never, context: ExecutionContext) => {
  switch (context.getType()) {
    case 'http': {
      const request = context.switchToHttp().getRequest();

      const tenantId: string = request?.headers.tenantid;
      if (!tenantId) {
        throw new BadRequestException('Tenant id is not identified.');
      }

      return tenantId;
    }
  }
});
