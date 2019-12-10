import {DefaultCrudRepository} from '@loopback/repository';
import {Proyecto, ProyectoRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProyectoRepository extends DefaultCrudRepository<
  Proyecto,
  typeof Proyecto.prototype.id,
  ProyectoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Proyecto, dataSource);
  }
}
