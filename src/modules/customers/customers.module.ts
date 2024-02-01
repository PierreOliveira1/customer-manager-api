import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';

@Module({
	controllers: [CustomersController],
	providers: [CustomersService, CreateCustomerUseCase, UpdateCustomerUseCase],
	exports: [CustomersService, CreateCustomerUseCase, UpdateCustomerUseCase],
})
export class CustomersModule {}
