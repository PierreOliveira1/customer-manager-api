import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CreateCustomerUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute(data: CreateCustomerDto) {
		const pool = this.db.getPool();

		try {
			await pool.query('BEGIN');

			const userAlreadyExists = await pool.query(
				'SELECT id FROM customers c WHERE c.email = $1',
				[data.email],
			);

			if (userAlreadyExists.rows.length > 0) {
				throw new BadRequestException({
					message: 'Este cliente já está cadastrado!',
				});
			}

			await pool.query(
				'INSERT INTO customers(id, name, email, phone_number, coordinate_x, coordinate_y) VALUES ($1, $2, $3, $4, $5, $6)',
				[
					uuidv4(),
					data.name,
					data.email,
					data.phoneNumber,
					data.coordinateX,
					data.coordinateY,
				],
			);

			await pool.query('COMMIT');

			return {
				message: 'Cliente cadastrado com sucesso!',
			};
		} catch (err) {
			await pool.query('ROLLBACK');

			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao cadastrar cliente.',
				});
			}

			throw err;
		}
	}
}
