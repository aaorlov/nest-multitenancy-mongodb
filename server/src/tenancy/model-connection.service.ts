import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';
import { Model, Connection, createConnection } from 'mongoose';

import { TenancyModuleOptions } from './interfaces';
import { CONNECTION_MAP, MODEL_DEFINITION_MAP, TENANT_MODULE_OPTIONS } from './tenancy.constants';
import { ConnectionMap, ModelDefinitionMap } from './types';

@Injectable()
export class ModelConnectionService {
  constructor(
    @Inject(TENANT_MODULE_OPTIONS) private readonly options: TenancyModuleOptions,
    @Inject(CONNECTION_MAP) private readonly connectionMap: ConnectionMap,
    @Inject(MODEL_DEFINITION_MAP) private readonly modelDefMap: ModelDefinitionMap,
  ) {}

  async getModel<T>(tenantId: string, modelDefinitionName: string): Promise<Model<T>> {
    const modelDefinitionExists = this.modelDefMap.has(modelDefinitionName);
    if (!modelDefinitionExists) {
      const modelDefinitionNotExistsErrorMsg = 'Model definition does not exist.';
      throw new InternalServerErrorException(modelDefinitionNotExistsErrorMsg);
    }
    const { name, collection, schema } = this.modelDefMap.get(modelDefinitionName);

    const exists = this.connectionMap.has(tenantId);

    let connection: Connection;
    if (exists) {
      connection = this.connectionMap.get(tenantId);
    } else {
      const connectionUri = `${this.options.baseUrl}/${tenantId}?authSource=admin`;

      connection = createConnection(connectionUri, this.options.dbOpts);

      this.modelDefMap.forEach(async (definition: ModelDefinition) => {
        connection.model(definition.name, definition.schema, definition.collection);
      });

      this.connectionMap.set(tenantId, connection);
    }

    return connection.models[name] || connection.model(name, schema, collection);
  }
}
