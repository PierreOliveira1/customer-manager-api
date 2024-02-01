import { Pagination } from 'src/miscs/entities';
import { Customer } from '../entities/customer.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllResponse extends Pagination<Customer[]> {
	@ApiProperty({ type: Customer, isArray: true })
	data: Customer[];
}

export class ErrorResponse {
	@ApiProperty({ type: String })
	message: string;
}
