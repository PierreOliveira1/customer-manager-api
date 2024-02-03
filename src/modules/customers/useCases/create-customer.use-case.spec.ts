import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from './create-customer.use-case';
import { DatabaseService } from 'src/database/database.service';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

describe('CreateCustomerUseCase', () => {
	let createCustomerUseCase: CreateCustomerUseCase;
	let databaseService: DatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCustomerUseCase,
				{
					provide: DatabaseService,
					useFactory: () => ({
						getPool: vitest.fn().mockReturnValue({
							query: vitest.fn().mockReturnValue({ rows: [] }),
						}),
					}),
				},
			],
		}).compile();

		createCustomerUseCase = module.get<CreateCustomerUseCase>(
			CreateCustomerUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should create a new customer successfully', async () => {
		const createCustomerDto: CreateCustomerDto = {
			name: 'John Doe',
			email: 'john@example.com',
			phoneNumber: '123456789',
			coordinateX: 1,
			coordinateY: 2,
		};

		const result = await createCustomerUseCase.execute(createCustomerDto);

		expect(result.message).toBe('Cliente cadastrado com sucesso!');
	});

	it('should throw BadRequestException if the customer already exists', async () => {
		databaseService.getPool = vitest.fn().mockReturnValue({
			query: vitest.fn().mockReturnValue({ rows: [{ id: 'existingUserId' }] }),
		});

		const createCustomerDto = {
			name: 'John Doe',
			email: 'john@example.com',
			phoneNumber: '123456789',
			coordinateX: 1,
			coordinateY: 2,
		};

		expect(createCustomerUseCase.execute(createCustomerDto)).rejects.toThrow();
	});

	it('should throw InternalServerErrorException on database error', async () => {
		databaseService.getPool = vitest.fn().mockReturnValue({
			query: vitest.fn().mockRejectedValueOnce(new Error('Database error')),
		});

		const createCustomerDto = {
			name: 'John Doe',
			email: 'john@example.com',
			phoneNumber: '123456789',
			coordinateX: 1,
			coordinateY: 2,
		};

		expect(createCustomerUseCase.execute(createCustomerDto)).rejects.toThrow();
	});
});
