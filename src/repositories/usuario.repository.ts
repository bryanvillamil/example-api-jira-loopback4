import { DefaultTransactionalRepository } from '@loopback/repository';
import { Usuario, UsuarioRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UsuarioRepository extends DefaultTransactionalRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Usuario, dataSource);
  }
}
