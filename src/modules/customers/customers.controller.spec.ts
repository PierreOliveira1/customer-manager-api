import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { vitest } from 'vitest';

describe('CustomersController', () => {
	let controller: CustomersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomersController],
			providers: [
				CustomersService,
				{
					provide: CreateCustomerUseCase,
					useValue: vitest.fn(),
				},
			],
		}).compile();

		controller = module.get<CustomersController>(CustomersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
