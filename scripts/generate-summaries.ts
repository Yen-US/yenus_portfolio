/**
 * Build-time script to generate AI summaries.
 * Run: npx tsx scripts/generate-summaries.ts
 *
 * Requires OPENAI_API_KEY environment variable.
 * Outputs to src/data/generated-summaries.json
 */

import OpenAI from "openai";
import { writeFileSync } from "fs";
import { join } from "path";

// Inline the resume context to avoid import issues from script
const RESUME_CONTEXT = `
You are summarizing the portfolio of Yenson Umana Solano (YenUS), a Full Stack Software Engineer from Costa Rica.

Experience:
- Full Stack Software Engineer at Wind River (2024/10 - Current): Cloud systems with Angular, Vue.js, JavaScript, Golang, Next.js, Java, Postgres, Docker, REST APIs, GRPC, GraphQL, AI methodologies.
- Junior Software Tools Engineer at Wind River (2023/09 - 2024/10): Solo engineer for Engineering Excellence department.
- Software Developer Internship at Wind River (2023/04 - 2023/09): Built first scaled agile framework documentation website.
- Technical Support Engineer / Solutions Development Engineer at Onereach.ai (2022/10 - 2024/04): Led and automated support operations.
- Technical Support Engineer at Wrike (2022/02 - 2023/04)
- Tier 2 Technical Support Engineer, SME at DocuSign (2021/01 - 2022/02)

Projects:
- Los Ticos Customs Store: Costa Rican custom tech store (React, Next.js, TypeScript)
- Eco Tico Crafts Store: Conservation project for local endangered species
- YUS Automation: AI automations business
- Notery.ai: Open source ChatGPT-like note improvement tool

Skills: React, Angular, Node, Express, PostgreSQL, Java, Linux, Nginx, JavaScript, TypeScript, Next.js, SQL, Docker
Education: Computer Engineer at TEC (2026)
`;

const PROMPTS = [
  "Write a 2-sentence executive summary of this engineer's profile for a tech recruiter.",
  "What are this engineer's strongest technical areas? Answer in 1-2 sentences.",
  "What makes this candidate stand out from other engineers? Answer in 1-2 sentences.",
  "Summarize this engineer's career progression in 2 sentences.",
  "What kind of team or company would be the best fit for this engineer? Answer in 1-2 sentences.",
];

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  const summaries: string[] = [];

  console.log("Generating AI summaries...\n");

  for (const prompt of PROMPTS) {
    console.log(`Prompt: ${prompt}`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: RESUME_CONTEXT },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";
    summaries.push(text);
    console.log(`  → ${text}\n`);
  }

  const outPath = join(__dirname, "..", "src", "data", "generated-summaries.json");
  writeFileSync(outPath, JSON.stringify(summaries, null, 2));
  console.log(`\nWritten ${summaries.length} summaries to ${outPath}`);
}

main();
