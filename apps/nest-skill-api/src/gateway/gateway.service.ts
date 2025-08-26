import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AllChat } from '../libs/dto/allchat/chat';
import { Model } from 'mongoose';
import { AllChatInput } from '../libs/dto/allchat/chat.input';

@Injectable()
export class GatewayService {
	private onlineUsers = new Set<string>();
	constructor(@InjectModel('AllChat') private readonly allChatModel: Model<AllChat>) {}

	public async saveMessage(input: AllChatInput): Promise<AllChat> {
		const created = new this.allChatModel({
			sender: input.sender,
			message: input.message,
			memberId: input.memberId || null,
		});
		const saved = await created.save();
		return saved.toObject();
	}

	public async getLastMessages(limit = 50): Promise<AllChat[]> {
		const messages = await this.allChatModel.find().sort({ createdAt: -1 }).limit(limit).populate('memberId').exec();
		return messages.reverse();
	}

	addOnlineUser(userId: string) {
		this.onlineUsers.add(userId);
	}

	removeOnlineUser(userId: string) {
		this.onlineUsers.delete(userId);
	}

	getOnlineCount(): number {
		return this.onlineUsers.size;
	}

	getOnlineUsers(): string[] {
		return Array.from(this.onlineUsers);
	}
}
