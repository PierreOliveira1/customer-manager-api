import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { FindAllCustomersUseCase } from './find-all-customers.use-case';
import { Queries } from 'src/miscs/entities';
import { DatabaseError } from 'pg';
import { InternalServerErrorException } from '@nestjs/common';

describe('FindAllCustomerUseCase', () => {
	let findAllCustomersUseCase: FindAllCustomersUseCase;
	let databaseService: DatabaseService;
	const queryMock = vitest.fn();

	beforeEach(async () => {
		queryMock.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindAllCustomersUseCase,
				{
					provide: DatabaseService,
					useValue: {
						getPool: vitest.fn().mockReturnValue({
							query: queryMock,
						}),
					},
				},
			],
		}).compile();

		findAllCustomersUseCase = module.get<FindAllCustomersUseCase>(
			FindAllCustomersUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should be defined', () => {
		expect(findAllCustomersUseCase).toBeDefined();
	});

	it('should find all customers successfully', async () => {
		const queries = new Queries({ page: 1, limit: 10 });

		queryMock
			.mockReturnValueOnce({
				rows: Array.from({ length: 10 }).map(() => ({
					id: 'dasdsad',
					name: 'Pierre Oliveira',
					email: 'pierre@gmail.com',
					phoneNumber: '77777777777',
				})),
			})
			.mockReturnValueOnce({ rows: [{ total: '10' }] });

		const results = await findAllCustomersUseCase.execute(queries, {
			search: null,
		});

		expect(results.data.length).toBe(10);
		expect(results.pagination.currentPage).toBe(1);
		expect(results.pagination.nextPage).toBeNull();
		expect(results.pagination.totalPages).toBe(1);
		expect(databaseService.getPool).toHaveBeenCalled();
	});

	it('should throw InternalServerErrorException on database error', async () => {
		const queries = new Queries({ page: 1, limit: 10 });

		queryMock
			.mockReturnValueOnce({
				rows: [
					{
						id: 'dasdsad',
						name: 'Pierre Oliveira',
						email: 'pierre@gmail.com',
						phoneNumber: '77777777777',
					},
				],
			})
			.mockRejectedValueOnce(new DatabaseError('Error', 1, 'error'));

		expect(
			findAllCustomersUseCase.execute(queries, { search: null }),
		).rejects.toThrow(
			new InternalServerErrorException({
				message: 'Erro ao buscar clientes.',
			}),
		);
		expect(databaseService.getPool).toHaveBeenCalled();
	});
});
