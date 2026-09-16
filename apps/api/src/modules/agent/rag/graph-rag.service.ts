import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';

export interface RetrievedKnowledgeItem {
  concept: string;
  category: string;
  description: string;
  strategies: string[];
}

@Injectable()
export class GraphRagService {
  private readonly logger = new Logger(GraphRagService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async retrieveContext(query: string, userId?: string): Promise<RetrievedKnowledgeItem[]> {
    try {
      // Extract keywords from the input query to match relevant graph nodes
      const terms = query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .slice(0, 5);

      if (terms.length === 0) {
        return [];
      }

      // Cypher query to retrieve matching mental health concepts and connected strategies
      const cypher = `
        MATCH (c:Concept)
        WHERE any(term IN $terms WHERE toLower(c.name) CONTAINS term OR toLower(c.description) CONTAINS term)
        OPTIONAL MATCH (c)-[:HAS_STRATEGY]->(s:Strategy)
        RETURN c.name AS concept, c.category AS category, c.description AS description, collect(s.name) AS strategies
        LIMIT 3
      `;

      const results = await this.neo4jService.read<{
        concept: string;
        category: string;
        description: string;
        strategies: string[];
      }>(cypher, { terms });

      return results.map((r) => ({
        concept: r.concept || 'General Support',
        category: r.category || 'Emotional Wellbeing',
        description: r.description || '',
        strategies: r.strategies || [],
      }));
    } catch (error) {
      this.logger.warn(`Failed to retrieve knowledge from Neo4j: ${error}`);
      return [];
    }
  }
}
