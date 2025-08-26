import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import AllChatSchema from '../schemas/AllChat.model';
import { GatewayService } from './gateway.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'AllChat', schema: AllChatSchema }])],
	providers: [ChatGateway, GatewayService],
	exports: [GatewayService],
})
export class GatewayModule {}
