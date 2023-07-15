import { Customer } from '../customer.entity';

test('should create a customer', () => {
  Customer.create({
    name: 'John Doe',
    cpf: '186.688.720-36',
  });
});
