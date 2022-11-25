import { Controller, Get, Post, Body } from '@nestjs/common';

import { TenantIdFromAccessToken } from '../decorators';
import { UsersService } from './users.service';
import { GetUsersResponseDto, CreateUserRequestDto, CreateUserResponseDto } from './dto';
import { IUserModel } from './models';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUsers(@TenantIdFromAccessToken() tenantId: string): Promise<GetUsersResponseDto> {
    const users: IUserModel[] = await this.usersService.getUsers(tenantId);

    return { users };
  }

  @Post()
  async createUser(@TenantIdFromAccessToken() tenantId: string, @Body() body: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const user: IUserModel = await this.usersService.createUser(tenantId, body);

    return { user };
  }
}
