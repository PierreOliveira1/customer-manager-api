import { Injectable } from '@nestjs/common';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomersService {
	constructor(
		private readonly createCustomerUseCase: CreateCustomerUseCase,
		private readonly updateCustomerUseCase: UpdateCustomerUseCase,
	) {}

	create(data: CreateCustomerDto) {
		return this.createCustomerUseCase.execute(data);
	}

	update(id: string, data: UpdateCustomerDto) {
		return this.updateCustomerUseCase.execute(id, data);
	}
}
