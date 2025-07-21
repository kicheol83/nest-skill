import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Order } from '../../libs/dto/order/order';
import { CreateOrderInput } from '../../libs/dto/order/order.input';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Order)
	public async createOrder(
		@Args('input') input: CreateOrderInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Muatation: createOrder');
		return await this.orderService.createOrder(memberId, [input]);
	}
}
