import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { AgentService } from './agent.service';
import { UserInsightsService } from './services/user-insights.service';
import { Neo4jSeedService } from '../neo4j/seed/neo4j-seed.service';
import { RunAgentDto } from './dto/run-agent.dto';
import { ReframeAgentDto } from './dto/reframe-agent.dto';
import type { SyncEntryPayload } from '@rewire/types';

@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly userInsightsService: UserInsightsService,
    private readonly neo4jSeedService: Neo4jSeedService,
  ) {}

  /**
   * Runs the LangGraph agentic cognitive reframing workflow.
   * Utilizes user history, past brain dumps, and Neo4j GraphRAG.
   */
  @Post('reframe')
  @HttpCode(HttpStatus.OK)
  async reframe(@Body() payload: ReframeAgentDto) {
    return await this.agentService.reframeThought(payload);
  }

  /**
   * Returns dynamic personal cognitive insights for a user from Neo4j graph traversals.
   */
  @Get('insights/:userId')
  async getInsights(@Param('userId') userId: string) {
    return await this.userInsightsService.getUserInsights(userId);
  }

  /**
   * Ingests / syncs a journal entry and its reframing outcome into the personal cognitive graph.
   */
  @Post('insights/sync-entry')
  @HttpCode(HttpStatus.OK)
  async syncEntry(@Body() payload: SyncEntryPayload) {
    await this.userInsightsService.syncEntryToGraph(payload);
    return { success: true };
  }

  /**
   * Backfills / syncs all historical journal entries for a user into the personal cognitive graph.
   */
  @Post('insights/sync-all/:userId')
  @HttpCode(HttpStatus.OK)
  async syncAllEntries(@Param('userId') userId: string) {
    return await this.userInsightsService.syncAllUserEntries(userId);
  }

  /**
   * Triggers idempotent seeding of the clinical CBT knowledge graph in Neo4j.
   */
  @Post('neo4j/seed')
  @HttpCode(HttpStatus.OK)
  async seedKnowledge() {
    return await this.neo4jSeedService.seedDatabase();
  }


  /**
   * Endpoint to trigger an AI job directly (useful for local development, testing, and debugging).
   */
  @Post('run')
  @HttpCode(HttpStatus.ACCEPTED)
  async runJob(@Body() payload: RunAgentDto) {
    // Process asynchronously or return acknowledgement
    await this.agentService.processAiJob(payload);
    return {
      status: 'accepted',
      runId: payload.runId,
    };
  }

  /**
   * Endpoint returning the visual image (PNG) of the LangGraph workflow.
   */
  @Get('graph/image')
  async getGraphImage(@Res() res: Response) {
    const imageBuffer = await this.agentService.getGraphImage();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', imageBuffer.length);
    res.end(imageBuffer);
  } 

  /**
   * Endpoint returning the Mermaid diagram syntax string.
   */
  @Get('graph/mermaid')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  getGraphMermaid(): string {
    return this.agentService.getGraphMermaid();
  }

  /**
   * Interactive HTML visualizer for the graph.
   */
  @Get('graph')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getGraphHtml(): string {
    const mermaid = this.agentService.getGraphMermaid();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LangGraph Workflow Visualizer - Rewire</title>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 32px 16px;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    h1 {
      margin: 0 0 8px 0;
      font-size: 26px;
      color: #38bdf8;
    }
    p {
      color: #94a3b8;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      max-width: 900px;
      width: 100%;
      overflow-x: auto;
      box-sizing: border-box;
    }
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    a.btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      background: #0284c7;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s ease;
    }
    a.btn:hover {
      background: #0369a1;
    }
    a.btn-secondary {
      background: #334155;
    }
    a.btn-secondary:hover {
      background: #475569;
    }
    .mermaid {
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <h1>Rewire LangGraph AI Workflow</h1>
  <p>Visual representation of the mental-health conversational AI workflow</p>
  <div class="card">
    <pre class="mermaid">
${mermaid}
    </pre>
  </div>
  <div class="actions">
    <a class="btn" href="/agent/graph/image" download="langgraph.png">⬇ Download PNG Image</a>
    <a class="btn btn-secondary" href="/agent/graph/image" target="_blank">Open PNG Direct</a>
    <a class="btn btn-secondary" href="/agent/graph/mermaid" target="_blank">View Mermaid Raw</a>
  </div>
</body>
</html>`;
  }
}
