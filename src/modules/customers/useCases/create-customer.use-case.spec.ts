import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from './create-customer.use-case';
import { DatabaseService } from 'src/database/database.service';
import { vitest } from 'vitest';

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
		const createCustomerDto = {
			name: 'John Doe',
			email: 'john@example.com',
			phoneNumber: '123456789',
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
		};

		expect(createCustomerUseCase.execute(createCustomerDto)).rejects.toThrow();
	});
});
