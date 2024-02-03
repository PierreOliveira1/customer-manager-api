import { DatabaseService } from 'src/database/database.service';
import { Customer } from '../entities/customer.entity';
import { DatabaseError } from 'pg';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FindRoutesCustomersUseCase {
	constructor(private readonly db: DatabaseService) {}

	async execute() {
		const pool = this.db.getPool();

		try {
			const result = await pool.query<Customer>(
				'SELECT id, name, email, phone_number AS "phoneNumber", coordinate_x AS "coordinateX", coordinate_y AS "coordinateY" FROM customers',
			);

			const route = this.calculateOptimalRoute(result.rows);

			return route;
		} catch (err) {
			if (err instanceof DatabaseError) {
				throw new InternalServerErrorException({
					message: 'Erro ao buscar rotas.',
				});
			}

			throw err;
		}
	}

	private calculateOptimalRoute(customers: Customer[]): Customer[] {
		const startingPoint: Customer = {
			id: '1',
			name: 'Empresa',
			email: 'empresa@gmail.com',
			phoneNumber: '',
			coordinateX: 0,
			coordinateY: 0,
		};
		const remainingCustomers = [...customers];
		const route: Customer[] = [];

		while (remainingCustomers.length > 0) {
			const lastPoint =
				route.length === 0 ? startingPoint : route[route.length - 1];
			let closestCustomer = remainingCustomers[0];
			let minDistance = this.calculateDistance(lastPoint, closestCustomer);

			for (let i = 1; i < remainingCustomers.length; i++) {
				const distance = this.calculateDistance(
					lastPoint,
					remainingCustomers[i],
				);
				if (distance < minDistance) {
					minDistance = distance;
					closestCustomer = remainingCustomers[i];
				}
			}

			route.push(closestCustomer);
			remainingCustomers.splice(remainingCustomers.indexOf(closestCustomer), 1);
		}

		return route;
	}

	private calculateDistance(point1: Customer, point2: Customer): number {
		const dx = point2.coordinateX - point1.coordinateX;
		const dy = point2.coordinateY - point1.coordinateY;
		return Math.sqrt(dx * dx + dy * dy);
	}
}
