import {DefaultCrudRepository} from '@loopback/repository';
import {Customer, CustomerRelations} from '../models';
import {DsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.custId,
  CustomerRelations
> {
  constructor(@inject('datasources.db') dataSource: DsDataSource) {
    super(Customer, dataSource);
  }
}
