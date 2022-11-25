import { IUserModel } from '../models';

export class GetUsersResponseDto {
  readonly users: IUserModel[];
}
