import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UpdateCustomerUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(id: string, data: UpdateCustomerDto) {
		const pool = this.db.getPool();

		try {
			await pool.query('BEGIN');

			const userExists = await pool.query(
				'SELECT id FROM customers c WHERE c.id = $1',
				[id],
			);

			if (userExists.rows.length === 0) {
				throw new NotFoundException({
					message: 'Cliente não encontrado!',
				});
			}

			const updateColumns = [];
			const updateValues = [];

			if (data.name) {
				updateColumns.push('name');
				updateValues.push(data.name);
			}

			if (data.email) {
				const emailInUse = await pool.query(
					'SELECT id FROM customers c WHERE c.email = $1 AND c.id <> $2',
					[data.email, id],
				);

				if (emailInUse.rows.length > 0) {
					throw new BadRequestException({
						message: 'Este e-mail já está cadastrado por outro cliente!',
					});
				}

				updateColumns.push('email');
				updateValues.push(data.email);
			}

			if (data.phoneNumber) {
				updateColumns.push('phone_number');
				updateValues.push(data.phoneNumber);
			}

			if (updateColumns.length > 0) {
				const setClause = updateColumns
					.map((column, index) => `${column} = $${index + 1}`)
					.join(', ');

				await pool.query(
					`UPDATE customers SET ${setClause} WHERE id = $${updateColumns.length + 1}`,
					[...updateValues, id],
				);
			}

			await pool.query('COMMIT');

			return {
				message: 'Cliente atualizado com sucesso!',
			};
		} catch (err) {
			await pool.query('ROLLBACK');

			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao atualizar cliente.',
				});
			}

			throw err;
		}
	}
}
