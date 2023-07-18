import { Uuid } from '../../../@shared/domain/value-objects/uuid.vo';
import { AgregateRoot } from '../../../@shared/domain/agregate-root';
import { Cpf } from '../../../@shared/domain/value-objects/cpf.vo';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AgregateRoot {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  constructor(props: CustomerConstructorProps) {
    super();

    this.id =
      typeof props.id === 'string' ?
      new CustomerId(props.id) :
      props.id ?? new CustomerId();
    this.cpf = props.cpf;
    this.name = props.name;
  }

  static create(command: { name: string; cpf: string }) {
    return new Customer({
      name: command.name,
      cpf: new Cpf(command.cpf),
    });
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
