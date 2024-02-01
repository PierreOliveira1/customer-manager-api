import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';

@Module({
	controllers: [CustomersController],
	providers: [CustomersService, CreateCustomerUseCase],
	exports: [CustomersService, CreateCustomerUseCase],
})
export class CustomersModule {}
