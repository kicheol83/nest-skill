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
import Redis from 'ioredis';
import { GatewayService } from './gateway.service';

@WebSocketGateway({
	cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private server: Server;
	private redisPub: Redis;
	private redisSub: Redis;

	constructor(private readonly chatService: GatewayService) {
		this.redisPub = new Redis();
		this.redisSub = new Redis();

		this.redisSub.subscribe('chat', (err, count) => {
			if (err) console.error('Redis subscribe error:', err);
			else console.log(`Subscribed to ${count} channel(s)`);
		});

		this.redisSub.on('message', (channel, message) => {
			if (channel === 'chat') {
				try {
					this.server.emit('chatMessage', JSON.parse(message));
				} catch (err) {
					console.debug('Invalid message from Redis:', err.message);
				}
			}
		});
	}

	afterInit(server: Server) {
		this.server = server;
		console.log('Socket server initialized');
	}

	async handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
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
		const savedMessage = await this.chatService.saveMessage({
			sender: data.sender,
			message: data.message,
		});

		await this.redisPub.publish('chat', JSON.stringify(savedMessage));
	}
}
