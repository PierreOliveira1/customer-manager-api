import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { QueriesDto } from 'src/miscs/dtos';
import { ErrorResponse, FindAllResponse } from './docs/responses';
import { Customer } from './entities/customer.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@ApiQuery({ name: 'page', type: String, required: false, example: '1' })
	@ApiQuery({ name: 'limit', type: String, required: false, example: '10' })
	@ApiResponse({ status: 200, type: FindAllResponse })
	@ApiResponse({ status: 500, type: ErrorResponse })
	@Get()
	findAll(@Query() queries: QueriesDto) {
		return this.customersService.findAll(queries);
	}

	@ApiResponse({ status: 200, type: ErrorResponse })
	@ApiResponse({ status: 500, type: ErrorResponse })
	@Post()
	create(@Body() data: CreateCustomerDto) {
		return this.customersService.create(data);
	}

	@ApiResponse({ status: 200, type: ErrorResponse })
	@ApiResponse({ status: 404, type: ErrorResponse })
	@ApiResponse({ status: 500, type: ErrorResponse })
	@Patch(':customerId')
	update(
		@Param('customerId') customerId: string,
		@Body() data: UpdateCustomerDto,
	) {
		return this.customersService.update(customerId, data);
	}

	@ApiResponse({ status: 200, type: Customer })
	@ApiResponse({ status: 500, type: ErrorResponse })
	@Get(':customerId')
	findOne(@Param('customerId') customerId: string) {
		return this.customersService.findOne(customerId);
	}

	@ApiResponse({ status: 200, type: ErrorResponse })
	@ApiResponse({ status: 404, type: ErrorResponse })
	@ApiResponse({ status: 500, type: ErrorResponse })
	@Delete(':customerId')
	delete(@Param('customerId') customerId: string) {
		return this.customersService.delete(customerId);
	}
}
