import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { vitest } from 'vitest';

describe('CustomersController', () => {
	let customersController: CustomersController;
	let customersService: CustomersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomersController],
			providers: [
				{
					provide: CustomersService,
					useFactory: () => ({
						create: vitest.fn(),
						update: vitest.fn(),
					}),
				},
			],
		}).compile();

		customersController = module.get<CustomersController>(CustomersController);
		customersService = module.get<CustomersService>(CustomersService);
	});

	it('should be defined', () => {
		expect(customersController).toBeDefined();
	});

	describe('create', () => {
		it('should call customersService.create with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '123456789',
			};

			customersController.create(createCustomerDto);

			expect(customersService.create).toHaveBeenCalledWith(createCustomerDto);
		});
	});

	describe('update', () => {
		it('should call customersService.update with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'John Doe',
				email: 'john@example.com',
				phoneNumber: '123456789',
			};

			const customerId = '2424';

			customersController.update(customerId, createCustomerDto);

			expect(customersService.update).toHaveBeenCalledWith(
				customerId,
				createCustomerDto,
			);
		});
	});
});
