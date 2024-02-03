import { IsOptional, IsString } from 'class-validator';

export class FiltersDto {
	@IsOptional()
	@IsString()
	search?: string;
}
