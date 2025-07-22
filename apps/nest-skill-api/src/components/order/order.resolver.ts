import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Order, Orders } from '../../libs/dto/order/order';
import { CreateOrderInput, OrderInquiry } from '../../libs/dto/order/order.input';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

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

	@UseGuards(AuthGuard)
	@Query((returns) => Order)
	public async getMyOrder(
		@Args('orderId') input: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Muatation: getMyOrder');
		const orderId = shapeIntoMongoObjectId(input);
		return await this.orderService.getMyOrder(memberId, orderId);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Orders)
	public async getMyOrders(
		@Args('input') input: OrderInquiry, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Orders> {
		console.log('📥 input:', input);
		return await this.orderService.getMyOrders(memberId, input);
	}
}
