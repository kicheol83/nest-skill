import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderInput } from '../../libs/dto/order/order.input';
import { Order, OrderItem } from '../../libs/dto/order/order';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('OrderItems') private readonly orderItemModel: Model<OrderItem>,

		private readonly memberService: MemberService,
	) {}

	public async createOrder(memberId: ObjectId, input: CreateOrderInput[]): Promise<Order> {
		const existingOrder = await this.orderModel.findOne({
			memberId,
			orderStatus: { $ne: OrderStatus.COMPLETED },
		});

		if (existingOrder) {
			throw new Error(Message.BAD_REQUEST);
		}
		try {
			const orderPrice = input.reduce((acc, item) => acc + item.itemPrice, 0); // ✅ orderPrice hisoblanmoqda
			const webTaxPrice = orderPrice + 150 ? 10 : 0;
			const totalPrice = orderPrice + webTaxPrice;

			const newOrder = await this.orderModel.create({
				orderPrice,
				webTax: webTaxPrice,
				totalPrice,
				memberId,
			});

			const orderId = newOrder._id;
			await this.recordOrderItem(orderId, input);

			return newOrder;
		} catch (err) {
			console.log('Error, orderModel:', err.message);
		}
	}

	private async recordOrderItem(orderId: ObjectId, input: CreateOrderInput[]): Promise<void> {
		const promisedList = input.map(async (item: CreateOrderInput) => {
			await this.orderItemModel.create({
				...item,
				orderId: shapeIntoMongoObjectId(orderId),
				providerId: shapeIntoMongoObjectId(item.providerId),
				itemPrice: item.itemPrice,
			});
			return 'INSERTED';
		});

		const orderItemState = await Promise.all(promisedList);
		console.log('orderItemState', orderItemState);
	}
}
