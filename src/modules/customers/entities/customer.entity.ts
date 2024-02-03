import { ApiProperty } from '@nestjs/swagger';

export class Customer {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phoneNumber: string;

	@ApiProperty()
	coordinateX: number;

	@ApiProperty()
	coordinateY: number;
}
