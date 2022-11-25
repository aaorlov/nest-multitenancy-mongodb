import { Module } from '@nestjs/common';

import { TenancyModule } from '@root/tenancy/tenancy.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    TenancyModule.forFeature([
      { name: UserEntity.name, schema: UserSchema }
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
