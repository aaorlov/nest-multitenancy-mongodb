import { DynamicModule, Module } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';

import { TenancyModuleAsyncOptions } from './interfaces';
import { TenancyCoreModule } from './tenancy-core.module';
import { TenancyFeatureModule } from './tenancy-feature.module';


@Module({})
export class TenancyModule {
  static forRootAsync = (options: TenancyModuleAsyncOptions): DynamicModule => ({
    module: TenancyModule,
    imports: [TenancyCoreModule.registerAsync(options)],
  });

  static forFeature = (models: ModelDefinition[]): DynamicModule => ({
    module: TenancyModule,
    imports: [TenancyFeatureModule.register(models)],
  });
}
