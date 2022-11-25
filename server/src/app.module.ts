import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

import { TenancyModule } from './tenancy/tenancy.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true,
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: Joi.object({
        PORT: Joi.string().optional(),
        MONGODB_HOST_URL: Joi.string().required(),
        MONGODB_USERNAME: Joi.string().required(),
        MONGODB_PASSWORD: Joi.string().required()
      }),
    }),
    TenancyModule.forRootAsync({
      useFactory: async (cfs: ConfigService) => ({
        baseUrl: `mongodb://${cfs.get<string>('MONGODB_USERNAME')}:${cfs.get<string>('MONGODB_PASSWORD')}@${cfs.get<string>('MONGODB_HOST_URL')}`,
        dbOpts: {
          retryWrites: false,
          connectTimeoutMS: 10000
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ]
})
export class AppModule {}
