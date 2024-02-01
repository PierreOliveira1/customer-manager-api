import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { vitest } from 'vitest';

describe('CustomersService', () => {
	let customersService: CustomersService;
	let createCustomerUseCase: CreateCustomerUseCase;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CustomersService,
				{
					provide: CreateCustomerUseCase,
					useFactory: () => ({
						execute: vitest.fn(),
					}),
				},
			],
		}).compile();

		customersService = module.get<CustomersService>(CustomersService);
		createCustomerUseCase = module.get<CreateCustomerUseCase>(
			CreateCustomerUseCase,
		);
	});

	it('should be defined', () => {
		expect(customersService).toBeDefined();
	});

	describe('create', () => {
		it('should call createCustomerUseCase.execute with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '123456789',
			};

			customersService.create(createCustomerDto);

			expect(createCustomerUseCase.execute).toHaveBeenCalledWith(
				createCustomerDto,
			);
		});
	});
});
