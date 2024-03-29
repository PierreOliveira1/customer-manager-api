import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';
import { FindOneCustomerUseCase } from './useCases/find-one-customer.use-case';
import { FindAllCustomersUseCase } from './useCases/find-all-customers.use-case';
import { DeleteCustomerUseCase } from './useCases/delete-customer.use-case';
import { FindRoutesCustomersUseCase } from './useCases/find-routes-customers.use-case';

@Module({
	controllers: [CustomersController],
	providers: [
		FindAllCustomersUseCase,
		CustomersService,
		CreateCustomerUseCase,
		UpdateCustomerUseCase,
		FindOneCustomerUseCase,
		DeleteCustomerUseCase,
		FindRoutesCustomersUseCase,
	],
	exports: [
		FindAllCustomersUseCase,
		CustomersService,
		CreateCustomerUseCase,
		UpdateCustomerUseCase,
		FindOneCustomerUseCase,
		DeleteCustomerUseCase,
		FindRoutesCustomersUseCase,
	],
})
export class CustomersModule {}
