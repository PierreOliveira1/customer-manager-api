import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	create(@Body() data: CreateCustomerDto) {
		return this.customersService.create(data);
	}
}
