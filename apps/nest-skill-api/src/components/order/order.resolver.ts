import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Order, Orders } from '../../libs/dto/order/order';
import { CreateOrderInput, OrderInquiry } from '../../libs/dto/order/order.input';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { UpdateOrderInput } from '../../libs/dto/order/order.update';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

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
		console.log('Muatation: getMyOrders');
		return await this.orderService.getMyOrders(memberId, input);
	}

	@Roles(MemberType.USER)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Order)
	public async updateMyOrder(
		@Args('input') input: UpdateOrderInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Query: updateMyOrder');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateMyOrder(memberId, input);
	}

	/** PROVIDER MEMBER **/
	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Order)
	public async updateMyOrderProvider(
		@Args('input') input: UpdateOrderInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Query: updateMyOrderProvider');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateMyOrderProvider(memberId, input);
	}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Query(() => Orders)
	public async getOrdersByProvider(@Args('input') input: OrderInquiry, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query, getOrdersByProvider');
		const providerOwnerId = shapeIntoMongoObjectId(memberId);
		return await this.orderService.getOrdersByProvider(providerOwnerId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Orders)
	public async getAllOrdersByAdmin(
		@Args('input') input: OrderInquiry, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Orders> {
		console.log('Muatation: getAllOrdersByAdmin');
		return await this.orderService.getAllOrdersByAdmin(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Order)
	public async updateOrderByAdmin(
		@Args('input') input: UpdateOrderInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Query: updateOrderByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateOrderByAdmin(memberId, input);
	}
}
