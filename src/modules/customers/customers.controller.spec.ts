import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { beforeEach, describe, expect, it, vitest } from 'vitest';

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
						findOne: vitest.fn().mockReturnValueOnce({
							id: '1234',
							name: 'Pierre Oliveira',
							email: 'pierre@gmail.com',
							phoneNumber: '77777777777',
						}),
						delete: vitest.fn().mockReturnValueOnce({
							message: 'Cliente deletado com sucesso.',
						}),
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
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
			};

			customersController.create(createCustomerDto);

			expect(customersService.create).toHaveBeenCalledWith(createCustomerDto);
		});
	});

	describe('update', () => {
		it('should call customersService.update with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
			};

			const customerId = '2424';

			customersController.update(customerId, createCustomerDto);

			expect(customersService.update).toHaveBeenCalledWith(
				customerId,
				createCustomerDto,
			);
		});
	});

	describe('findOne', () => {
		it('should call customersService.findOne with the provided data', async () => {
			const customerId = '2424';

			const result = await customersController.findOne(customerId);

			expect(customersService.findOne).toHaveBeenCalledWith(customerId);
			expect(result).toEqual({
				id: '1234',
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
			});
		});
	});

	describe('delete', () => {
		it('should call customersService.delete with the provided data', async () => {
			const customerId = '2424';

			const result = await customersController.delete(customerId);

			expect(customersService.delete).toHaveBeenCalledWith(customerId);
			expect(result).toEqual({
				message: 'Cliente deletado com sucesso.',
			});
		});
	});
});
