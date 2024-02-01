import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCustomerUseCase } from './update-customer.use-case';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { vitest } from 'vitest';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';

describe('UpdateCustomerUseCase', () => {
	let updateCustomerUseCase: UpdateCustomerUseCase;
	let databaseService: DatabaseService;
	const queryMock = vitest.fn();

	beforeEach(async () => {
		queryMock.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateCustomerUseCase,
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

		updateCustomerUseCase = module.get<UpdateCustomerUseCase>(
			UpdateCustomerUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should be defined', () => {
		expect(updateCustomerUseCase).toBeDefined();
	});

	it('should update a customer successfully', async () => {
		const data: UpdateCustomerDto = {
			name: 'Updated Name',
			email: 'updated.email@example.com',
			phoneNumber: '987654321',
		};

		const customerId = 'customerId';

		queryMock
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [{ id: 'rerwer' }] })
			.mockReturnValueOnce({ rows: [] })
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined);

		const result = await updateCustomerUseCase.execute(customerId, data);

		expect(result.message).toBe('Cliente atualizado com sucesso!');
		expect(databaseService.getPool().query).toHaveBeenCalledTimes(5);
		expect(databaseService.getPool().query).toHaveBeenCalledWith('BEGIN');
		expect(databaseService.getPool().query).toHaveBeenCalledWith(
			'SELECT id FROM customers c WHERE c.email = $1 AND c.id <> $2',
			[data.email, customerId],
		);
		expect(databaseService.getPool().query).toHaveBeenCalledWith(
			'UPDATE customers SET name = $1, email = $2, phone_number = $3 WHERE id = $4',
			[data.name, data.email, data.phoneNumber, customerId],
		);
		expect(databaseService.getPool().query).toHaveBeenCalledWith('COMMIT');
	});

	it('should throw BadRequestException if email is already in use', async () => {
		const updateCustomerDto: UpdateCustomerDto = {
			name: 'Updated Name',
			email: 'existing.email@example.com',
			phoneNumber: '987654321',
		};

		const customerId = 'customerId';

		queryMock
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [{ id: 'rerwer' }] })
			.mockReturnValueOnce({ rows: [{ id: 'rerwer' }] })
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined);

		expect(
			updateCustomerUseCase.execute(customerId, updateCustomerDto),
		).rejects.toThrow(
			new BadRequestException({
				message: 'Este e-mail já está cadastrado por outro cliente!',
			}),
		);
	});

	it('should throw BadRequestException if customer does not exist', async () => {
		const updateCustomerDto: UpdateCustomerDto = {
			name: 'Updated Name',
			email: 'updated.email@example.com',
			phoneNumber: '987654321',
		};

		const customerId = 'nonExistingCustomerId';

		queryMock
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce({ rows: [] })
			.mockReturnValueOnce({ rows: [] })
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined);

		expect(
			updateCustomerUseCase.execute(customerId, updateCustomerDto),
		).rejects.toThrow(
			new BadRequestException({
				message: 'Cliente não encontrado!',
			}),
		);
	});

	it('should throw InternalServerErrorException on database error', async () => {
		const updateCustomerDto: UpdateCustomerDto = {
			name: 'Updated Name',
			email: 'updated.email@example.com',
			phoneNumber: '987654321',
		};

		const customerId = 'customerId';

		queryMock
			.mockReturnValueOnce(undefined)
			.mockRejectedValueOnce(new DatabaseError('Error', 1, 'error'))
			.mockReturnValueOnce({ rows: [] })
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined);

		expect(
			updateCustomerUseCase.execute(customerId, updateCustomerDto),
		).rejects.toThrow(
			new InternalServerErrorException({
				message: 'Erro ao atualizar cliente.',
			}),
		);
	});
});
