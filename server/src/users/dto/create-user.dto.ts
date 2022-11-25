import { IUserModel } from '../models';

export class CreateUserRequestDto {
  readonly firstName?: string;
  readonly lastName?: string;
}

export class CreateUserResponseDto {
  readonly user: IUserModel;
}
