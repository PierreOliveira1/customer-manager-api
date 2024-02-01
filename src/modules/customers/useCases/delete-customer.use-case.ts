import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DeleteCustomerUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(id: string) {
		const pool = this.db.getPool();

		try {
			await pool.query('BEGIN');

			const customerAlreadyExists = await pool.query(
				'SELECT * FROM customers c WHERE c.id = $1',
				[id],
			);

			if (customerAlreadyExists.rows.length === 0) {
				throw new NotFoundException({
					message: 'Cliente não encontrado.',
				});
			}

			await pool.query('DELETE FROM customers c WHERE c.id = $1', [id]);

			await pool.query('COMMIT');
			return {
				message: 'Cliente deletado com sucesso.',
			};
		} catch (err) {
			await pool.query('ROLLBACK');
			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao deletar cliente.',
				});
			}

			throw err;
		}
	}
}
