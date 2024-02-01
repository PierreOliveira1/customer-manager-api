import { DatabaseService } from 'src/database/database.service';
import { DeleteCustomerUseCase } from './delete-customer.use-case';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';

describe('DeleteCustomerUseCase', () => {
	let deleteCustomerUseCase: DeleteCustomerUseCase;
	let databaseService: DatabaseService;
	const queryMock = vitest.fn();

	beforeEach(async () => {
		queryMock.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteCustomerUseCase,
				{
					provide: DatabaseService,
					useFactory: () => ({
						getPool: vitest.fn().mockReturnValue({
							query: queryMock,
						}),
					}),
				},
			],
		}).compile();

		deleteCustomerUseCase = module.get<DeleteCustomerUseCase>(
			DeleteCustomerUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should be defined', () => {
		expect(deleteCustomerUseCase).toBeDefined();
		expect(databaseService).toBeDefined();
	});

	it('should delete a customer successfully', async () => {
		const customerId = 'asdasd';

		queryMock
			.mockReturnValue(undefined)
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [{ id: 'dasdas' }] });

		const result = await deleteCustomerUseCase.execute(customerId);

		const query = databaseService.getPool().query;

		expect(result.message).toBe('Cliente deletado com sucesso.');
		expect(query).toHaveBeenCalledTimes(4);
		expect(query).toHaveBeenCalledWith('BEGIN');
		expect(query).toHaveBeenCalledWith(
			'SELECT * FROM customers c WHERE c.id = $1',
			[customerId],
		);
		expect(query).toHaveBeenCalledWith(
			'DELETE FROM customers c WHERE c.id = $1',
			[customerId],
		);
		expect(query).toHaveBeenCalledWith('COMMIT');
	});

	it('should throw NotFoundException if customer not exists', async () => {
		const customerId = 'asdasd';

		queryMock
			.mockReturnValue(undefined)
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [] });

		expect(deleteCustomerUseCase.execute(customerId)).rejects.toThrow(
			new NotFoundException({
				message: 'Cliente não encontrado.',
			}),
		);
	});

	it('should throw InternalServerErrorException on database error', async () => {
		const customerId = 'dasdsad';

		queryMock
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [{ id: 'dasd' }] })
			.mockRejectedValueOnce(new DatabaseError('Error', 1, 'error'))
			.mockReturnValueOnce(undefined);

		expect(deleteCustomerUseCase.execute(customerId)).rejects.toThrow(
			new InternalServerErrorException({
				message: 'Erro ao deletar cliente.',
			}),
		);
	});
});
