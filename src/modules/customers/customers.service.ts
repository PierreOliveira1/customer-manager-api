import { Injectable } from '@nestjs/common';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { FindOneCustomerUseCase } from './useCases/find-one-customer.use-case';
import { DeleteCustomerUseCase } from './useCases/delete-customer.use-case';
import { FiltersDto, QueriesDto } from 'src/miscs/dtos';
import { FindAllCustomersUseCase } from './useCases/find-all-customers.use-case';

@Injectable()
export class CustomersService {
	constructor(
		private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
		private readonly createCustomerUseCase: CreateCustomerUseCase,
		private readonly updateCustomerUseCase: UpdateCustomerUseCase,
		private readonly findOneCustomerUseCase: FindOneCustomerUseCase,
		private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
	) {}

	findAll(queries: QueriesDto, { search }: FiltersDto) {
		return this.findAllCustomersUseCase.execute(
			{
				limit: +queries.limit,
				page: +queries.page,
			},
			{ search },
		);
	}

	create(data: CreateCustomerDto) {
		return this.createCustomerUseCase.execute(data);
	}

	update(id: string, data: UpdateCustomerDto) {
		return this.updateCustomerUseCase.execute(id, data);
	}

	findOne(id: string) {
		return this.findOneCustomerUseCase.execute(id);
	}

	delete(id: string) {
		return this.deleteCustomerUseCase.execute(id);
	}
}
