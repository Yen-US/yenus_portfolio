/**
 * Build-time script to generate an ATS / AI-tier-optimized resume PDF.
 * Run: pnpm generate-ai-resume
 *
 * Requires OPENAI_API_KEY. Outputs public/yenson-ai-resume.pdf.
 *
 * ATS-friendly choices: single column, Helvetica only, plain bullets,
 * no tables, no images, no headers/footers, standard section names.
 */

import OpenAI from "openai";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { join } from "path";
import { RESUME_CONTEXT } from "../src/lib/ai";
import { profile } from "../src/lib/resume-data";

interface AiResume {
  name: string;
  title: string;
  contact: { email: string; website: string; linkedin: string; github: string; location: string };
  summary: string;
  coreCompetencies: string[];
  experience: Array<{
    role: string;
    company: string;
    location: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{ name: string; description: string; tech: string[] }>;
  certifications: string[];
  education: Array<{ degree: string; institution: string; status?: string }>;
  keywords: string[];
}

const SYSTEM_PROMPT = `You produce ATS- and AI-screener-optimized resumes.

Rules:
- Output VALID JSON only, matching the provided schema. No prose, no markdown fences.
- Optimize bullets for AI/ATS parsing: start with a strong action verb, quantify when possible, embed concrete tech keywords inline.
- Prefer industry-standard keywords AI screeners look for (e.g. "LLM", "RAG", "agentic systems", "vector database", "Azure OpenAI", "MCP", "CI/CD", "TypeScript", "Python").
- 3–5 bullets per experience. Keep each bullet under ~25 words.
- "summary" is 3–4 sentences, written in first person omitted (resume style), front-loading the AI architecture identity.
- "coreCompetencies" is a flat list of 10–14 short skill phrases (mix of tech + leadership).
- "keywords" is a flat list of 20–30 single-word or short-phrase ATS keywords (technologies, methodologies, certifications) to be rendered at the bottom of the resume for screener recall.
- Use only information present in the provided portfolio context. Do not invent companies, dates, or metrics.
`;

const USER_PROMPT = `Generate the AI-optimized resume JSON for the following portfolio:

${RESUME_CONTEXT}

Return JSON matching this TypeScript type exactly:

interface AiResume {
  name: string;
  title: string;
  contact: { email: string; website: string; linkedin: string; github: string; location: string };
  summary: string;
  coreCompetencies: string[];
  experience: Array<{ role: string; company: string; location: string; period: string; bullets: string[] }>;
  projects: Array<{ name: string; description: string; tech: string[] }>;
  certifications: string[];
  education: Array<{ degree: string; institution: string; status?: string }>;
  keywords: string[];
}`;

async function generateResume(): Promise<AiResume> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  console.log("Asking GPT-4o for ATS-optimized resume JSON…");
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const raw = res.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from OpenAI");

  return JSON.parse(raw) as AiResume;
}

function renderPdf(resume: AiResume, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      info: {
        Title: `${resume.name} — Resume`,
        Author: resume.name,
        Subject: "Resume",
        Keywords: resume.keywords.join(", "),
      },
    });

    const stream = createWriteStream(outPath);
    doc.pipe(stream);
    stream.on("finish", () => resolve());
    stream.on("error", reject);

    const COLOR_TEXT = "#111111";
    const COLOR_MUTED = "#555555";
    const COLOR_RULE = "#cccccc";

    doc.font("Helvetica");

    // Header
    doc.fillColor(COLOR_TEXT).font("Helvetica-Bold").fontSize(20).text(resume.name);
    doc.moveDown(0.15);
    doc.font("Helvetica").fontSize(11).fillColor(COLOR_MUTED).text(resume.title);
    doc.moveDown(0.3);

    const c = resume.contact;
    const contactLine = [c.location, c.email, c.website, c.linkedin, c.github]
      .filter(Boolean)
      .join("  •  ");
    doc.fontSize(9).fillColor(COLOR_MUTED).text(contactLine);
    doc.moveDown(0.6);

    const section = (title: string) => {
      doc
        .moveDown(0.4)
        .fillColor(COLOR_TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(title.toUpperCase(), { characterSpacing: 1 });
      const y = doc.y + 2;
      doc
        .moveTo(doc.page.margins.left, y)
        .lineTo(doc.page.width - doc.page.margins.right, y)
        .strokeColor(COLOR_RULE)
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.4);
    };

    const body = (text: string) => {
      doc.fillColor(COLOR_TEXT).font("Helvetica").fontSize(10).text(text, {
        align: "left",
        lineGap: 2,
      });
    };

    const bullet = (text: string) => {
      doc.fillColor(COLOR_TEXT).font("Helvetica").fontSize(10).text(`•  ${text}`, {
        indent: 6,
        lineGap: 2,
      });
    };

    // Summary
    section("Summary");
    body(resume.summary);

    // Core competencies
    section("Core Competencies");
    body(resume.coreCompetencies.join("  •  "));

    // Experience
    section("Experience");
    resume.experience.forEach((job, i) => {
      if (i > 0) doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLOR_TEXT).text(`${job.role} — ${job.company}`);
      doc.font("Helvetica-Oblique").fontSize(9).fillColor(COLOR_MUTED).text(`${job.location}  •  ${job.period}`);
      doc.moveDown(0.2);
      job.bullets.forEach(bullet);
    });

    // Projects
    if (resume.projects?.length) {
      section("Selected Projects");
      resume.projects.forEach((p, i) => {
        if (i > 0) doc.moveDown(0.2);
        doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR_TEXT).text(p.name, { continued: true });
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(COLOR_TEXT)
          .text(` — ${p.description}`);
        if (p.tech?.length) {
          doc.font("Helvetica-Oblique").fontSize(9).fillColor(COLOR_MUTED).text(p.tech.join(", "));
        }
      });
    }

    // Certifications
    if (resume.certifications?.length) {
      section("Certifications");
      resume.certifications.forEach((cert) => bullet(cert));
    }

    // Education
    if (resume.education?.length) {
      section("Education");
      resume.education.forEach((e) => {
        body(`${e.degree} — ${e.institution}${e.status ? ` (${e.status})` : ""}`);
      });
    }

    // Keywords (for ATS recall)
    if (resume.keywords?.length) {
      section("Keywords");
      doc.font("Helvetica").fontSize(9).fillColor(COLOR_MUTED).text(resume.keywords.join(" · "), {
        lineGap: 2,
      });
    }

    doc.end();
  });
}

async function main() {
  const resume = await generateResume();

  // Override AI-generated contact fields with authoritative values from resume-data.
  resume.contact = {
    email: profile.email,
    website: profile.website,
    linkedin: profile.links.linkedin,
    github: profile.links.github,
    location: profile.location,
  };
  resume.name = profile.name;

  const outPath = join(__dirname, "..", "public", "yenson-ai-resume.pdf");
  await renderPdf(resume, outPath);
  console.log(`\nWritten ATS-optimized resume to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
