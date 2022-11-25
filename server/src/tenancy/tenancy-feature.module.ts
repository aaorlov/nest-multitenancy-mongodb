import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';

import { CONNECTION_MAP, MODEL_DEFINITION_MAP, DEFINITION_SUFFIX } from './tenancy.constants';

@Global()
@Module({})
export class TenancyFeatureModule {
  static register(models: ModelDefinition[]): DynamicModule {
    const providers: Provider[] = models.reduce((res: Provider[], model: ModelDefinition) => {
      const { name, schema, collection } = model;
      return [
        ...res,
        {
          provide: `${name}${DEFINITION_SUFFIX}`,
          useFactory: (modelDefinitionMap: Record<string, any>, connectionMap: Record<string, any>) => {
            const exists = modelDefinitionMap.has(name);
            if (!exists) {
              modelDefinitionMap.set(name, { ...model });

              connectionMap.forEach((connection: Record<string, any>) => connection.model(name, schema, collection));
            }
          },
          inject: [MODEL_DEFINITION_MAP, CONNECTION_MAP],
        },
      ];
    }, []);

    return {
      module: TenancyFeatureModule,
      providers,
      exports: providers,
    };
  }
}
