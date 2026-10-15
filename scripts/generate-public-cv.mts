/**
 * Generates the public CV PDF from the same data the site renders at `/cv`.
 * Run: pnpm generate-public-cv   (Node 22.18+ strips the TypeScript types)
 *
 * No network and no model calls: the text is exactly the site's data. Output: public/yenson-ai-resume.pdf,
 * the URL every existing CV link already points to. The CV Yenson originally
 * supplied is kept out of `public/` as provenance; see docs/cv/PROVENANCE.md.
 *
 * Print legibility: body and list text are 12pt, headings larger. Single
 * column, standard section names, Helvetica only, so ATS parsers read it.
 */

import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import {
  certifications,
  competencies,
  cvProjects,
  education,
  experience,
  keywords,
  person,
  summary,
} from "../src/lib/portfolio-data.ts";

const BODY = 12;
const MARGIN = 54;
const INK = "#141416";
const MUTED = "#4a4a50";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "yenson-ai-resume.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
  info: {
    Title: `${person.fullName} - CV`,
    Author: person.fullName,
    Subject: person.role,
    Keywords: keywords.join(", "),
  },
});
// The date the CV content was last confirmed, not the build time.
doc.info.CreationDate = new Date("2026-10-15T00:00:00Z");

const width = doc.page.width - MARGIN * 2;

function heading(text: string) {
  doc.moveDown(0.9);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(text.toUpperCase(), { characterSpacing: 1 });
  const y = doc.y + 2;
  doc.moveTo(MARGIN, y).lineTo(MARGIN + width, y).lineWidth(0.75).strokeColor("#c9c9cc").stroke();
  doc.moveDown(0.45);
}

function body(text: string, opts: PDFKit.Mixins.TextOptions = {}) {
  doc.font("Helvetica").fontSize(BODY).fillColor(INK).text(text, { lineGap: 2, ...opts });
}

function bullets(items: string[]) {
  // Native list: wrapped lines hang under the text, not under the bullet.
  doc.font("Helvetica").fontSize(BODY).fillColor(INK).list(items, {
    bulletRadius: 1.6,
    bulletIndent: 2,
    textIndent: 12,
    lineGap: 2,
    paragraphGap: 2,
  });
}

// Header
doc.font("Helvetica-Bold").fontSize(24).fillColor(INK).text(person.fullName);
doc.font("Helvetica").fontSize(14).fillColor(MUTED).text(person.role);
doc.moveDown(0.3);
body([person.location, person.email, "yenus.dev"].join("  |  "), { lineGap: 0 });
body(["linkedin.com/in/yenus", "github.com/Yen-US"].join("  |  "), { lineGap: 0 });

heading("Summary");
body(summary);

heading("Core competencies");
body(competencies.join(", "));

heading("Experience");
experience.forEach((role, i) => {
  if (i > 0) doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(BODY).fillColor(INK).text(`${role.title}, ${role.org}`);
  doc.font("Helvetica").fontSize(BODY).fillColor(MUTED).text(`${role.place}  |  ${role.dates}`);
  doc.moveDown(0.2);
  bullets(role.points);
});

heading("Selected projects");
cvProjects.forEach((project, i) => {
  if (i > 0) doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(BODY).fillColor(INK).text(`${project.name}. `, { continued: true });
  doc.font("Helvetica").text(project.body, { lineGap: 2 });
  doc.fillColor(MUTED).text(project.stack);
});

heading("Certifications");
bullets(certifications.map((c) => (c.code ? `${c.code}: ${c.name}` : c.name)));

heading("Education");
body(`${education.degree}, ${education.school} (${education.status})`);

heading("Keywords");
body(keywords.join(", "));

doc.pipe(createWriteStream(outPath));
doc.end();
console.log(`Wrote ${outPath}`);
