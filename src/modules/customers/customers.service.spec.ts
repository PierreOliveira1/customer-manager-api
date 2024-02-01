import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CreateCustomerUseCase } from './useCases/create-customer.use-case';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { UpdateCustomerUseCase } from './useCases/update-customer.use-case';
import { FindOneCustomerUseCase } from './useCases/find-one-customer.use-case';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { DeleteCustomerUseCase } from './useCases/delete-customer.use-case';
import { FindAllCustomersUseCase } from './useCases/find-all-customers.use-case';
import { Pagination } from 'src/miscs/entities';

describe('CustomersService', () => {
	let customersService: CustomersService;
	let findAllCustomersUseCase: FindAllCustomersUseCase;
	let createCustomerUseCase: CreateCustomerUseCase;
	let updateCustomerUseCase: UpdateCustomerUseCase;
	let findOneCustomerUseCase: FindOneCustomerUseCase;
	let deleteCustomerUseCase: DeleteCustomerUseCase;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CustomersService,
				{
					provide: FindAllCustomersUseCase,
					useFactory: () => ({
						execute: vitest.fn().mockReturnValueOnce(
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
					}),
				},
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
				{
					provide: FindOneCustomerUseCase,
					useFactory: () => ({
						execute: vitest.fn().mockReturnValueOnce({
							id: '1234',
							name: 'Pierre Oliveira',
							email: 'pierre@gmail.com',
							phoneNumber: '77777777777',
						}),
					}),
				},
				{
					provide: DeleteCustomerUseCase,
					useFactory: () => ({
						execute: vitest.fn().mockReturnValue({
							message: 'Cliente deletado com sucesso.',
						}),
					}),
				},
			],
		}).compile();

		customersService = module.get<CustomersService>(CustomersService);
		findAllCustomersUseCase = module.get<FindAllCustomersUseCase>(
			FindAllCustomersUseCase,
		);
		createCustomerUseCase = module.get<CreateCustomerUseCase>(
			CreateCustomerUseCase,
		);
		updateCustomerUseCase = module.get<UpdateCustomerUseCase>(
			UpdateCustomerUseCase,
		);
		findOneCustomerUseCase = module.get<FindOneCustomerUseCase>(
			FindOneCustomerUseCase,
		);
		deleteCustomerUseCase = module.get<DeleteCustomerUseCase>(
			DeleteCustomerUseCase,
		);
	});

	it('should be defined', () => {
		expect(customersService).toBeDefined();
	});

	describe('findAll', () => {
		it('should call findAllCustomersUseCase.execute with the provided data', async () => {
			const queries = { limit: '10', page: '1' };

			const result = await customersService.findAll(queries);

			expect(findAllCustomersUseCase.execute).toHaveBeenCalledWith({
				page: +queries.page,
				limit: +queries.limit,
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
			const updateCustomerDto: UpdateCustomerDto = {
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
			};

			const id = '123123';

			customersService.update(id, updateCustomerDto);

			expect(updateCustomerUseCase.execute).toHaveBeenCalledWith(
				id,
				updateCustomerDto,
			);
		});
	});

	describe('findOne', () => {
		it('should call findOneCustomerUseCase.execute with the provided data', async () => {
			const id = '123123';

			const result = await customersService.findOne(id);

			expect(findOneCustomerUseCase.execute).toHaveBeenCalledWith(id);
			expect(result).toEqual({
				id: '1234',
				name: 'Pierre Oliveira',
				email: 'pierre@gmail.com',
				phoneNumber: '77777777777',
			});
		});
	});

	describe('delete', () => {
		it('should call deleteCustomerUseCase.execute with the provided data', async () => {
			const id = '123123';

			const result = await customersService.delete(id);

			expect(deleteCustomerUseCase.execute).toHaveBeenCalledWith(id);
			expect(result.message).toBe('Cliente deletado com sucesso.');
		});
	});
});
