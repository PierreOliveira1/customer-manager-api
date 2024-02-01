import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
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
}
