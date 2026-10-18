/**
 * Content for the homepage at `/`: a showroom of the two products Yenson
 * built from scratch and runs today, then the rest of the record in brief.
 *
 * Sources, all verifiable:
 * - Presencia Studio: the live site (www.presencia.studio, its public pages
 *   captured 2026-10-16 into public/products/presencia) and the CV.
 * - Listo: the live site (usalisto.com, public pages captured the same day
 *   into public/products/listo). The founder confirmed on 2026-10-16 that
 *   both products were created from scratch by him.
 * - AOP Beacon: the public repository. Azure migration: the CV.
 * - Roles and dates: `portfolio-data.ts` (CV, founder-confirmed end dates).
 *
 * Rules, enforced by `home-data.test.ts`: no education or certification text
 * on the homepage; no traction, revenue, user counts or outcomes; no current
 * employment claim for Microsoft or Wind River; plain hyphens only.
 */

import { experience, person } from "@/lib/portfolio-data";

export { person };

export const intro = {
  /** Visible H1. The name is in the header and the accessible name. */
  title: "Senior AI Solution Architect. I build products from scratch and advise startups on production AI.",
  stageLabel: "Two products I run today",
};

export type Screen = { src: string; label: string };

export type Product = {
  id: "presencia" | "listo";
  name: string;
  url: string;
  domain: string;
  /** What it does, in one sentence. */
  line: string;
  /** What Yenson built, in one sentence. */
  built: string;
  /** Design decisions visible in the product itself. Behind a disclosure. */
  decisions: string[];
  screens: Screen[];
  desktop: Screen;
  /** Brand tint for the stage, read from the live product. */
  tint: { field: string; ink: string; accent: string };
};

export const products: Product[] = [
  {
    id: "presencia",
    name: "Presencia Studio",
    url: "https://www.presencia.studio",
    domain: "presencia.studio",
    line: "Web pages, digital business cards, QR menus and loyalty cards for small businesses in Costa Rica.",
    built:
      "Founded in 2025 and built from scratch on Next.js 16, Supabase and Vercel: hosted profiles, QR menus merchants edit from their phone, loyalty cards customers keep in their wallet with a staff scanner, ONVO payments, Spanish first with English.",
    decisions: [
      "Merchants change their own prices and menus; the printed QR never changes.",
      "Every loyalty stamp is validated by an authorized person, never by the customer.",
    ],
    screens: [
      { src: "/products/presencia/home-phone.webp", label: "Home" },
      { src: "/products/presencia/tarjeta-digital-phone.webp", label: "Digital card in the phone wallet" },
      { src: "/products/presencia/restaurantes-phone.webp", label: "QR menu for restaurants" },
      { src: "/products/presencia/loyalty-phone.webp", label: "Presencia Loyalty" },
    ],
    desktop: { src: "/products/presencia/home-desktop.webp", label: "presencia.studio on a laptop" },
    tint: { field: "#f4dca1", ink: "#0b0b0a", accent: "#0b0b0a" },
  },
  {
    id: "listo",
    name: "Listo",
    url: "https://usalisto.com",
    domain: "usalisto.com",
    line: "Home repairs in Guanacaste: describe the job, get a quote from a vetted technician, pay by card or SINPE.",
    built:
      "Launched in 2026 and built from scratch: the web app on Next.js 16 and Supabase, a WhatsApp quoting flow, customer and provider emails, ONVO card and SINPE payments, and the admin that confirms them.",
    decisions: [
      "Quotes are made per job, never from a price list.",
      "A technician's contact is shared only after the payment is confirmed.",
      "Requesting offers is free and needs no WhatsApp account.",
    ],
    screens: [
      { src: "/products/listo/home-phone.webp", label: "Home" },
      { src: "/products/listo/cotizar-phone.webp", label: "Request a quote" },
      { src: "/products/listo/electricidad-phone.webp", label: "Electrical work in Guanacaste" },
      { src: "/products/listo/propiedades-phone.webp", label: "Pilot for property managers in Tamarindo" },
    ],
    desktop: { src: "/products/listo/home-desktop.webp", label: "usalisto.com on a laptop" },
    tint: { field: "#0f5f3f", ink: "#ffffff", accent: "#ffb020" },
  },
];

export const alsoBuilt = [
  {
    name: "AOP Beacon",
    body:
      "NFC beacons at live-event tables open an AI conversation prompt. The model gets four seconds, then a curated prompt takes over, and names never reach the model.",
    link: { href: "https://github.com/Yen-US/amplification-of-potential", label: "Source on GitHub" },
  },
  {
    name: "Vercel + GCP to Azure in one week",
    body:
      "A startup's full production migration, run with Claude Code and MCP as Microsoft for Startups advisory. One cutover, an acceptance gate per subsystem.",
  },
];

/** The three employed roles on the CV, newest first; Presencia is above as a product. */
export const roles = experience
  .filter((r) => r.id !== "presencia")
  .map((r) => ({ org: r.org, title: r.title, dates: r.dates }));

export const contact = {
  title: "Have a role in mind? Send it.",
  consulting: "Startup looking for independent AI architecture advice?",
};

export const navigation = [
  { href: "/#work", label: "Products" },
  { href: "/#also", label: "Also built" },
  { href: "/work/customer-acquisition", label: "Client work" },
  { href: "/#experience", label: "Experience" },
  { href: "/cv", label: "CV" },
  { href: "/consulting", label: "Consulting" },
];
