import { Controller, Get, Logger } from '@nestjs/common';
import { NestBatchService } from './nest-batch.service';
import { Cron, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_PROVIDER_POST, BATCH_TOP_PROVIDERS } from './lib/config';

@Controller()
export class NestBatchController {
	constructor(private readonly nestBatchService: NestBatchService) {}

	private logger: Logger = new Logger('BatchController');

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY');
	}

	@Cron('00 00 01 * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED');
			await this.nestBatchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
		this.logger['context'] = BATCH_ROLLBACK;
		this.logger.debug('EXECUTED');
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_PROVIDER_POST })
	public async batchTopProperties() {
		try {
			this.logger['context'] = BATCH_TOP_PROVIDER_POST;
			this.logger.debug('EXECUTED');
			await this.nestBatchService.batchTopProperties();
		} catch (err) {
			this.logger.error(err);
		}
		this.logger['context'] = BATCH_ROLLBACK;
		this.logger.debug('EXECUTED');
	}

	@Cron('40 00 01 * * *', { name: BATCH_TOP_PROVIDERS })
	public async batchTopAgents() {
		try {
			this.logger['context'] = BATCH_TOP_PROVIDERS;
			this.logger.debug('EXECUTED');
			await this.nestBatchService.batchTopAgents();
		} catch (err) {
			this.logger.error(err);
		}
		this.logger['context'] = BATCH_ROLLBACK;
		this.logger.debug('EXECUTED');
	}

	@Get()
	getHello(): string {
		return this.nestBatchService.getHello();
	}
}
