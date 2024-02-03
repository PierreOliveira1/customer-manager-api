import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateCustomerDto {
	@ApiProperty()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	name: string;

	@ApiProperty()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	@IsEmail()
	email: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@MinLength(1)
	@MaxLength(20)
	@IsNumberString()
	phoneNumber?: string;

	@ApiProperty()
	@IsNumber()
	@MinLength(1)
	@MaxLength(1000000)
	coordinateX: number;

	@ApiProperty()
	@IsNumber()
	@MinLength(1)
	@MaxLength(1000000)
	coordinateY: number;
}
