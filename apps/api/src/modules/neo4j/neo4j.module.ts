import { Module, Global } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { Neo4jSeedService } from './seed/neo4j-seed.service';

@Global()
@Module({
  providers: [Neo4jService, Neo4jSeedService],
  exports: [Neo4jService, Neo4jSeedService],
})
export class Neo4jModule {}

