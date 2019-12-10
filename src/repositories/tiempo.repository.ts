import {DefaultCrudRepository} from '@loopback/repository';
import {Tiempo, TiempoRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TiempoRepository extends DefaultCrudRepository<
  Tiempo,
  typeof Tiempo.prototype.id,
  TiempoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Tiempo, dataSource);
  }
}
