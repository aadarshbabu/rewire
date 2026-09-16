import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SqsConsumerService } from './modules/queue/sqs-consumer.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`NestJS AI Worker API listening on http://localhost:${port}`);

  // If running locally with SQS polling enabled
  if (process.env.ENABLE_LOCAL_SQS_POLLER === 'true') {
    const sqsConsumer = app.get(SqsConsumerService);
    sqsConsumer.startLocalPoller().catch((err) => {
      logger.error('Error in local SQS poller', err);
    });
  }
}
bootstrap();
