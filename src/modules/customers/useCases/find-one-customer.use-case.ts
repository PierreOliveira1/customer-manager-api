import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class FindOneCustomerUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(id: string) {
		const pool = this.db.getPool();

		try {
			const result = await pool.query<Customer>(
				'SELECT id, name, email, phone_number as "phoneNumber" FROM customers c WHERE c.id = $1',
				[id],
			);

			if (result.rows.length === 0) {
				throw new BadRequestException({
					message: 'Cliente não encontrado.',
				});
			}

			const customer = result.rows[0];

			return customer;
		} catch (err) {
			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao buscar cliente.',
				});
			}

			throw err;
		}
	}
}
