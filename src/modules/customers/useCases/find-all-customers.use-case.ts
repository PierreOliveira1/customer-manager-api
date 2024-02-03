import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Filters, Pagination, Queries } from 'src/miscs/entities';
import { Customer } from '../entities/customer.entity';
import { DatabaseError } from 'pg';

@Injectable()
export class FindAllCustomersUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(queries: Queries, filters: Filters) {
		const { limit, page } = queries;
		const pool = this.db.getPool();

		try {
			const offset = (page - 1) * limit;

			const query: string[] = [];
			const params: (number | string)[] = [];
			query.push(
				'SELECT id, name, email, phone_number AS "phoneNumber", coordinate_x AS "coordinateX", coordinate_y AS "coordinateY" FROM customers c',
			);

			if (filters?.search) {
				const id = params.length + 1;
				query.push(
					`WHERE c.name ILIKE $${id} OR c.email ILIKE $${id} OR c.phone_number ILIKE $${id}`,
				);
				params.push(`%${filters.search}%`);
			}

			query.push(`LIMIT $${params.length + 1} OFFSET $${params.length + 2}`);
			params.push(limit, offset);

			const [result, totalResult] = await Promise.all([
				pool.query<Customer>(query.join(' '), [...params]),
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
