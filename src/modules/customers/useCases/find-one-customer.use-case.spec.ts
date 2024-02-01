import { Test, TestingModule } from '@nestjs/testing';
import { FindOneCustomerUseCase } from './find-one-customer.use-case';
import { DatabaseService } from 'src/database/database.service';
import { vitest } from 'vitest';
import { BadRequestException } from '@nestjs/common';

describe('FindOneCustomerUseCase', () => {
	let findOneCustomerUseCase: FindOneCustomerUseCase;
	let databaseService: DatabaseService;
	const queryMock = vitest.fn();

	beforeEach(async () => {
		queryMock.mockReset();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindOneCustomerUseCase,
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

		findOneCustomerUseCase = module.get<FindOneCustomerUseCase>(
			FindOneCustomerUseCase,
		);
		databaseService = module.get<DatabaseService>(DatabaseService);
	});

	it('should be defined', () => {
		expect(findOneCustomerUseCase).toBeDefined();
	});

	it('should find a customer successfully', async () => {
		const customerId = 'customerId';

		queryMock.mockReturnValueOnce({
			rows: [
				{
					id: customerId,
					name: 'Pierre Oliveira',
					email: 'pierre@gmail.com',
					phoneNumber: '77777777777',
				},
			],
		});

		const result = await findOneCustomerUseCase.execute(customerId);

		expect(result.id).toBe(customerId);
		expect(result.name).toBe('Pierre Oliveira');
		expect(result.email).toBe('pierre@gmail.com');
		expect(result.phoneNumber).toBe('77777777777');
		expect(databaseService.getPool).toHaveBeenCalled();
	});

	it('should throw BadRequestException if customer is not found', async () => {
		const customerId = 'nonExistingCustomerId';

		queryMock.mockReturnValueOnce({ rows: [] });

		expect(findOneCustomerUseCase.execute(customerId)).rejects.toThrow(
			new BadRequestException({
				message: 'Cliente não encontrado.',
			}),
		);
		expect(databaseService.getPool).toHaveBeenCalled();
	});
});
