import { Module } from '@nestjs/common';
import { SqsConsumerService } from './sqs-consumer.service';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [AgentModule],
  providers: [SqsConsumerService],
  exports: [SqsConsumerService],
})
export class QueueModule {}
