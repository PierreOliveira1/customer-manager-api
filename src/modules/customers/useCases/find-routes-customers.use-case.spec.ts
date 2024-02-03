import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { DatabaseError } from 'pg';
import { InternalServerErrorException } from '@nestjs/common';
import { FindRoutesCustomersUseCase } from './find-routes-customers.use-case';

describe('FindRoutesCustomersUseCase', () => {
	let findRoutesCustomersUseCase: FindRoutesCustomersUseCase;
	let databaseService: DatabaseService;
	const queryMock = vitest.fn();

	beforeEach(async () => {
		queryMock.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindRoutesCustomersUseCase,
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

		findRoutesCustomersUseCase = module.get<FindRoutesCustomersUseCase>(
			FindRoutesCustomersUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should be defined', () => {
		expect(findRoutesCustomersUseCase).toBeDefined();
	});

	it('should find routes customers successfully', async () => {
		queryMock
			.mockReturnValueOnce({
				rows: Array.from({ length: 10 }).map(() => ({
					id: 'dasdsad',
					name: 'Pierre Oliveira',
					email: 'pierre@gmail.com',
					phoneNumber: '77777777777',
					coordinateX: 1,
					coordinateY: 2,
				})),
			})
			.mockReturnValueOnce({ rows: [{ total: '10' }] });

		const results = await findRoutesCustomersUseCase.execute();

		expect(results.length).toBe(10);
		expect(databaseService.getPool).toHaveBeenCalled();
	});

	it('should throw InternalServerErrorException on database error', async () => {
		queryMock.mockRejectedValueOnce(new DatabaseError('Error', 1, 'error'));

		expect(findRoutesCustomersUseCase.execute()).rejects.toThrow(
			new InternalServerErrorException({
				message: 'Erro ao buscar rotas.',
			}),
		);
		expect(databaseService.getPool).toHaveBeenCalled();
	});
});
