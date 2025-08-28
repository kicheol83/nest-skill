import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
	public pub: Redis;
	public sub: Redis;

	constructor() {
		this.pub = new Redis();
		this.sub = new Redis();
	}

	subscribe(channel: string, callback: (message: string) => void) {
		this.sub.subscribe(channel, (err, count) => {
			if (err) console.error('Redis subscribe error:', err);
			else console.log(`Subscribed to ${count} channel(s)`);
		});

		this.sub.on('message', (chan, message) => {
			if (chan === channel) callback(message);
		});
	}

	async publish(channel: string, message: any) {
		await this.pub.publish(channel, JSON.stringify(message));
	}

	onModuleDestroy() {
		this.pub.disconnect();
		this.sub.disconnect();
	}
}
