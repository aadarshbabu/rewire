import { Module, Global } from '@nestjs/common';
import { RedisStreamService } from './redis-stream.service';

@Global()
@Module({
  providers: [RedisStreamService],
  exports: [RedisStreamService],
})
export class RedisModule {}
