import neo4j from 'neo4j-driver';
import * as fs from 'fs';
import * as path from 'path';
import {
  SEED_CONCEPTS,
  SEED_STRATEGIES,
  SEED_TRIGGERS,
  SEED_EMOTIONS,
} from './neo4j-seed.data';

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../../../../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnvFile();

async function runStandaloneSeed() {


  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USERNAME || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  console.log(`Connecting to Neo4j at ${uri}...`);
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  try {
    const serverInfo = await driver.getServerInfo();
    console.log(`Connected to Neo4j: ${serverInfo.agent}`);

    const session = driver.session();
    try {
      console.log('Seeding emotions...');
      for (const em of SEED_EMOTIONS) {
        await session.executeWrite((tx) =>
          tx.run(
            `MERGE (e:Emotion {name: $name})
             SET e.valence = $valence`,
            { name: em.name, valence: em.valence },
          ),
        );
      }

      console.log('Seeding triggers...');
      for (const tr of SEED_TRIGGERS) {
        await session.executeWrite((tx) =>
          tx.run(
            `MERGE (t:TriggerCategory {name: $name})
             SET t.description = $description`,
            { name: tr.name, description: tr.description },
          ),
        );
      }

      console.log('Seeding strategies...');
      for (const st of SEED_STRATEGIES) {
        await session.executeWrite((tx) =>
          tx.run(
            `MERGE (s:Strategy {name: $name})
             SET s.category = $category,
                 s.description = $description,
                 s.promptGuidance = $promptGuidance`,
            {
              name: st.name,
              category: st.category,
              description: st.description,
              promptGuidance: st.promptGuidance,
            },
          ),
        );

        for (const emotionName of st.counteractsEmotions) {
          await session.executeWrite((tx) =>
            tx.run(
              `MATCH (s:Strategy {name: $strategyName})
               MATCH (e:Emotion {name: $emotionName})
               MERGE (s)-[:COUNTERACTS]->(e)`,
              { strategyName: st.name, emotionName },
            ),
          );
        }
      }

      console.log('Seeding concepts and associations...');
      for (const cp of SEED_CONCEPTS) {
        await session.executeWrite((tx) =>
          tx.run(
            `MERGE (c:Concept {name: $name})
             SET c.category = $category,
                 c.description = $description,
                 c.commonThoughts = $commonThoughts`,
            {
              name: cp.name,
              category: cp.category,
              description: cp.description,
              commonThoughts: cp.commonThoughts,
            },
          ),
        );

        for (const stratName of cp.strategies) {
          await session.executeWrite((tx) =>
            tx.run(
              `MATCH (c:Concept {name: $conceptName})
               MATCH (s:Strategy {name: $stratName})
               MERGE (c)-[:HAS_STRATEGY]->(s)`,
              { conceptName: cp.name, stratName },
            ),
          );
        }

        for (const trigName of cp.triggers) {
          await session.executeWrite((tx) =>
            tx.run(
              `MATCH (c:Concept {name: $conceptName})
               MATCH (t:TriggerCategory {name: $trigName})
               MERGE (c)-[:TRIGGERED_BY]->(t)`,
              { conceptName: cp.name, trigName },
            ),
          );
        }

        for (const emoName of cp.emotions) {
          await session.executeWrite((tx) =>
            tx.run(
              `MATCH (c:Concept {name: $conceptName})
               MATCH (e:Emotion {name: $emoName})
               MERGE (c)-[:EVOKES]->(e)`,
              { conceptName: cp.name, emoName },
            ),
          );
        }
      }

      console.log('✅ Neo4j mental health knowledge seeding completed successfully!');
    } finally {
      await session.close();
    }
  } catch (err) {
    console.error('❌ Failed to seed Neo4j:', err);
    process.exit(1);
  } finally {
    await driver.close();
  }
}

runStandaloneSeed();
