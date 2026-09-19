import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Neo4jService.name);
  private driver: Driver | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const uri = this.configService.get<string>('NEO4J_URI') || 'bolt://localhost:7687';
    const user =
      this.configService.get<string>('NEO4J_USERNAME') ||
      this.configService.get<string>('NEO4J_USER') ||
      'neo4j';
    const password = this.configService.get<string>('NEO4J_PASSWORD') || 'password';

    try {
      this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
      this.logger.log(`Initialized Neo4j driver connection to: ${uri}`);
    } catch (error) {
      this.logger.error('Failed to initialize Neo4j driver', error);
    }
  }

  getDriver(): Driver | null {
    return this.driver;
  }

  getSession(database?: string): Session | null {
    if (!this.driver) {
      this.logger.warn('Neo4j driver is not initialized');
      return null;
    }
    return this.driver.session(database ? { database } : undefined);
  }

  async read<T = Record<string, any>>(
    cypher: string,
    params: Record<string, any> = {},
    database?: string,
  ): Promise<T[]> {
    const session = this.getSession(database);
    if (!session) {
      return [];
    }

    try {
      const result = await session.executeRead((tx) => tx.run(cypher, params));
      return result.records.map((record) => record.toObject() as T);
    } catch (error) {
      this.logger.error(`Error running Cypher read query: ${cypher}`, error);
      return [];
    } finally {
      await session.close();
    }
  }

  async write<T = Record<string, any>>(
    cypher: string,
    params: Record<string, any> = {},
    database?: string,
  ): Promise<T[]> {
    const session = this.getSession(database);
    if (!session) {
      return [];
    }

    try {
      const result = await session.executeWrite((tx) => tx.run(cypher, params));
      return result.records.map((record) => record.toObject() as T);
    } catch (error) {
      this.logger.error(`Error running Cypher write query: ${cypher}`, error);
      return [];
    } finally {
      await session.close();
    }
  }

  async onModuleDestroy() {
    if (this.driver) {
      await this.driver.close();
      this.logger.log('Closed Neo4j driver connection');
    }
  }
}
