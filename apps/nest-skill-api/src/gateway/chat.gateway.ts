import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
	cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private server: Server;

	constructor(
		private readonly chatService: GatewayService,
		private readonly redisService: RedisService,
	) {
		this.redisService.subscribe('chat', (message) => {
			try {
				this.server.emit('chatMessage', JSON.parse(message));
			} catch (err) {
				console.debug('Invalid message from Redis:', err.message);
			}
		});

		this.redisService.subscribe('notification', (msg) => {
			const notification = JSON.parse(msg);
			console.log('Redis message received:', notification);

			const sockets = Array.from(this.server.sockets.sockets.values());
			sockets.forEach((s) => {
				if (s.data?.userId === notification.receiverId) {
					console.log('Emitting notification to socket:', s.id);
					s.emit('notification', notification);
				}
			});
		});
	}

	afterInit(server: Server) {
		this.server = server;
		console.log('Socket server initialized');
	}

	async handleConnection(client: Socket) {
		const userId = client.handshake.query.userId as string;
		client.data.userId = userId;

		console.log(`Client connected: ${client.id} (userId: ${userId})`);
		this.chatService.addOnlineUser(client.id);
		this.server.emit('onlineUsers', this.chatService.getOnlineCount());

		const lastMessages = await this.chatService.getLastMessages();
		client.emit('chatMessage', lastMessages);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.chatService.removeOnlineUser(client.id);
		this.server.emit('onlineUsers', this.chatService.getOnlineCount());
	}

	@SubscribeMessage('sendMessage')
	async handleMessage(@MessageBody() data: { sender: string; message: string }, @ConnectedSocket() client: Socket) {
		const savedMessage = await this.chatService.saveMessage(data);
		await this.redisService.publish('chat', savedMessage);
	}
}
