import { NestFactory } from '@nestjs/core';
import { NestBatchModule } from './nest-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(NestBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
