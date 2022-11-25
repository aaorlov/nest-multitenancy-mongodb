import { ConnectOptions } from 'mongoose';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface TenancyModuleOptions extends Record<string, any> {
  baseUrl: string;
  dbOpts: ConnectOptions;
}

export interface TenancyOptionsFactory {
  createTenancyOptions(): Promise<TenancyModuleOptions> | TenancyModuleOptions;
}

export interface TenancyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TenancyOptionsFactory>;
  useClass?: Type<TenancyOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<TenancyModuleOptions> | TenancyModuleOptions;
  inject?: any[];
}
