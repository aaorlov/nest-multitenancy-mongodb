import { Injectable } from '@nestjs/common';

import { ModelConnectionService } from '@root/tenancy/model-connection.service';

import {CreateUserRequestDto} from "@root/users/dto";
import { UserEntity, UserDocument } from './entities/user.entity';
import { IUserModel } from './models';

@Injectable()
export class UsersService {
  constructor(
    private readonly modelConnectionService: ModelConnectionService
  ) {}

  async getUsers(tenantId: string): Promise<IUserModel[]> {
    const userDbModel = await this.modelConnectionService.getModel(tenantId, UserEntity.name);

    const dbUsers = await userDbModel.find().exec();

    return dbUsers.map((dbUser: UserDocument) => dbUser.toJSON() as IUserModel)
  }

  async createUser(tenantId: string, data: CreateUserRequestDto): Promise<IUserModel> {
    const userDbModel = await this.modelConnectionService.getModel(tenantId, UserEntity.name);

    const newUser = new userDbModel({...data, tenantId})
    await newUser.save()

    return newUser.toJSON() as IUserModel
  }
}
