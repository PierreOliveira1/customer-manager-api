import { Injectable } from '@nestjs/common';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Injectable()
export class CustomersService {
	constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

	create(data: CreateCustomerDto) {
		return this.createCustomerUseCase.execute(data);
	}
}
