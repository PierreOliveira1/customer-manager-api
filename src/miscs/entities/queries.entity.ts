export class Queries {
	page?: number;

	limit?: number;

	constructor(data: Queries) {
		this.limit = data.limit;
		this.page = data.page;
	}
}
