import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
	@ApiProperty()
	totalPages: number;

	@ApiProperty()
	currentPage: number;

	@ApiProperty({ type: Number })
	nextPage: number | null;
}

type PaginationParams = {
	page: number;
	limit: number;
	total: number;
};

export class Pagination<T> {
	@ApiProperty()
	data: T;

	@ApiProperty({ type: PaginationDto })
	pagination: PaginationDto;

	constructor(data: T, params: PaginationParams) {
		const { limit, page, total } = params;
		const totalPages = Math.ceil(total / limit);
		const currentPage = page;
		const nextPage = currentPage + 1 > totalPages ? null : currentPage + 1;

		this.data = data;
		this.pagination = {
			totalPages,
			currentPage,
			nextPage,
		};
	}
}
