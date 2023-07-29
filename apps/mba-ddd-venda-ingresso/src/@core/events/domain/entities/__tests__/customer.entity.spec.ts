import { Cpf } from '../../../../@shared/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from '../customer.entity';

test('should create a customer', () => {
  const customer = Customer.create({
    name: 'John Doe',
    cpf: '186.688.720-36',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.name).toBe('John Doe');
  expect(customer.cpf.value).toBe('18668872036');

  const customer2 = new Customer({
    id: new CustomerId(customer.id.value),
    name: 'John Xpto',
    cpf: new Cpf('370.341.390-59'),
  });

  expect(customer.equals(customer2)).toBeTruthy();
});
