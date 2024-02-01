import { IsNumberString, IsOptional } from 'class-validator';

export class QueriesDto {
	@IsOptional()
	@IsNumberString()
	page = '1';

	@IsOptional()
	@IsNumberString()
	limit = '10';
}
