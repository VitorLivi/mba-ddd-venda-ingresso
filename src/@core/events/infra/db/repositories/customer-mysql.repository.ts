import { EntityManager } from '@mikro-orm/mysql';
import { Customer, CustomerId } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer-repository.interface';

export class CustomerMysqlRepository implements ICustomerRepository {
  constructor(private entityManager: EntityManager) {}

  async add(customer: Customer): Promise<void> {
    this.entityManager.persist(customer);
  }

  async findById(id: string | CustomerId): Promise<Customer> {
    return this.entityManager.findOneOrFail(Customer, {
      id: typeof id === 'string' ? new CustomerId(id) : id,
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.entityManager.find(Customer, {});
  }

  async delete(customer: Customer): Promise<void> {
    this.entityManager.remove(customer);
  }
}
