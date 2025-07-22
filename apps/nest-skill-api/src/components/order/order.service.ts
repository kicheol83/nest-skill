import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderInput, OrderInquiry } from '../../libs/dto/order/order.input';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

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

	public async getMyOrder(memberId: ObjectId, orderId: ObjectId): Promise<Order> {
		const search: T = {
			_id: orderId,
			memberId: memberId,
			orderStatus: {
				$in: [
					OrderStatus.PENDING,
					OrderStatus.CONFIRMED,
					OrderStatus.IN_PROGRESS,
					OrderStatus.COMPLETED,
					OrderStatus.PAID,
					OrderStatus.CANCELED,
					OrderStatus.REJECTED,
					OrderStatus.EXPIRED,
					OrderStatus.REFUNDED,
				],
			},
		};

		const targetOrder: Order = await this.orderModel.findOne(search).lean().exec();
		if (!targetOrder) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		targetOrder.memberData = await this.memberService.getMember(null, targetOrder.memberId);
		return targetOrder;
	}

	public async getMyOrders(memberId: ObjectId, input: OrderInquiry): Promise<Orders> {
		const match: T = {
			memberId: memberId,
			orderStatus: {
				$in: [
					OrderStatus.PENDING,
					OrderStatus.CONFIRMED,
					OrderStatus.IN_PROGRESS,
					OrderStatus.COMPLETED,
					OrderStatus.PAID,
					OrderStatus.CANCELED,
					OrderStatus.REJECTED,
					OrderStatus.EXPIRED,
					OrderStatus.REFUNDED,
				],
			},
		};
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		console.log('match:', match);

		const result = await this.orderModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}
