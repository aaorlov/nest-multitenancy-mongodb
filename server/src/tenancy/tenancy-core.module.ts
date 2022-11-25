import { DynamicModule, Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ModelConnectionService } from './model-connection.service';
import { TenancyModuleAsyncOptions } from './interfaces';
import { CONNECTION_MAP, MODEL_DEFINITION_MAP, TENANT_MODULE_OPTIONS } from './tenancy.constants';
import { ConnectionMap, ModelDefinitionMap } from './types';

@Global()
@Module({})
export class TenancyCoreModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  static registerAsync(options: TenancyModuleAsyncOptions): DynamicModule {
    const tenancyModuleOptionsProvider = {
      provide: TENANT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const connectionMapProvider = {
      provide: CONNECTION_MAP,
      useFactory: (): ConnectionMap => new Map(),
    };

    const modelDefinitionMapProvider = {
      provide: MODEL_DEFINITION_MAP,
      useFactory: (): ModelDefinitionMap => new Map(),
    };

    const providers = [
      tenancyModuleOptionsProvider,
      connectionMapProvider,
      modelDefinitionMapProvider,
      ModelConnectionService,
    ];

    return {
      module: TenancyCoreModule,
      imports: options.imports,
      providers: providers,
      exports: providers,
    };
  }

  async onApplicationShutdown() {
    const connectionMap: ConnectionMap = this.moduleRef.get(CONNECTION_MAP);

    await Promise.all([...connectionMap.values()].map((connection) => connection.close()));
  }
}
