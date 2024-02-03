import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { Pagination } from 'src/miscs/entities';

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
						findAll: vitest.fn().mockReturnValueOnce(
							new Pagination(
								Array.from({ length: 10 }).map(() => ({
									id: '1234',
									name: 'Pierre Oliveira',
									email: 'pierre@gmail.com',
									phoneNumber: '77777777777',
								})),
								{ limit: 10, page: 1, total: 10 },
							),
						),
						findRoute: vitest.fn().mockReturnValueOnce(
							Array.from({ length: 10 }).map(() => ({
								id: '1234',
								name: 'Pierre Oliveira',
								email: 'pierre@gmail.com',
								phoneNumber: '77777777777',
							})),
						),
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

	describe('findAll', () => {
		it('should call customersService.findAll with the provided data', async () => {
			const queries = { page: '1', limit: '10' };

			const result = await customersController.findAll(queries, {
				search: null,
			});

			expect(customersService.findAll).toHaveBeenCalledWith(queries, {
				search: null,
			});
			expect(result).toEqual(
				new Pagination(
					Array.from({ length: 10 }).map(() => ({
						id: '1234',
						name: 'Pierre Oliveira',
						email: 'pierre@gmail.com',
						phoneNumber: '77777777777',
					})),
					{ limit: 10, page: 1, total: 10 },
				),
			);
		});
	});

	describe('findRoute', () => {
		it('should call customersService.findRoute with the provided data', async () => {
			const result = await customersController.findRoute();

			expect(customersService.findRoute).toHaveBeenCalledTimes(1);
			expect(result).toEqual(
				Array.from({ length: 10 }).map(() => ({
					id: '1234',
					name: 'Pierre Oliveira',
					email: 'pierre@gmail.com',
					phoneNumber: '77777777777',
				})),
			);
		});
	});

	describe('create', () => {
		it('should call customersService.create with the provided data', () => {
			const createCustomerDto: CreateCustomerDto = {
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
				coordinateX: 0,
				coordinateY: 2,
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
				coordinateX: 0,
				coordinateY: 2,
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
