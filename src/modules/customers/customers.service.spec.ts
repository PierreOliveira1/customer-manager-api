import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { vitest } from 'vitest';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';

describe('CustomersService', () => {
	let customersService: CustomersService;
	let createCustomerUseCase: CreateCustomerUseCase;
	let updateCustomerUseCase: UpdateCustomerUseCase;

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
				{
					provide: UpdateCustomerUseCase,
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
		updateCustomerUseCase = module.get<UpdateCustomerUseCase>(
			UpdateCustomerUseCase,
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

	describe('update', () => {
		it('should call updateCustomerUseCase.execute with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '123456789',
			};

			const id = '123123';

			customersService.update(id, createCustomerDto);

			expect(updateCustomerUseCase.execute).toHaveBeenCalledWith(
				id,
				createCustomerDto,
			);
		});
	});
});
