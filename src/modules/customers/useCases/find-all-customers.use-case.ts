import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Pagination, Queries } from 'src/miscs/entities';
import { Customer } from '../entities/customer.entity';
import { DatabaseError } from 'pg';

@Injectable()
export class FindAllCustomersUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(queries: Queries) {
		const { limit, page } = queries;
		const pool = this.db.getPool();

		try {
			const offset = (page - 1) * limit;

			const [result, totalResult] = await Promise.all([
				pool.query<Customer>('SELECT * FROM customers LIMIT $1 OFFSET $2', [
					limit,
					offset,
				]),
				pool.query<{ total: string }>(
					'SELECT COUNT(id) AS total FROM customers',
				),
			]);

			const total = parseInt(totalResult.rows[0].total, 10);

			return new Pagination(result.rows, { page, limit, total });
		} catch (err) {
			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao buscar clientes.',
				});
			}

			throw err;
		}
	}
}
