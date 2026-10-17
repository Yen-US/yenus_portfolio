/**
 * Content for `/work/customer-acquisition`: client systems Yenson designed,
 * built and operates through Presencia Studio. Distinct from the products he
 * founded (Presencia Studio, Listo), which stay on `/`.
 *
 * Sources, all public or founder-confirmed, read 2026-10-17:
 * - Guanacaste Earthmoving: the live pages www.presencia.studio/p/ge and
 *   /p/ge/en (their copy, photography, fleet, spec sheets, quiz and WhatsApp
 *   links), captured into public/work/customer-acquisition/ge.
 * - JR Rodríguez: the live pages www.presencia.studio/jr-art-gallery and /es
 *   (artwork, commission steps, inquiry form), the public Facebook page posts,
 *   and the release record of the inquiry inbox (2026-10-17).
 *
 * Rules, enforced by `client-work-data.test.ts`: no revenue, lead counts,
 * conversion, ROAS, budgets, testimonials or awards; no sale claimed for the
 * JR campaign; no paying-customer claim for GE; JR is the painter, Presencia
 * built the sales technology; no account ids, dashboard URLs or private data.
 */

export type Screen = { src: string; label: string };

export type ClientCase = {
  id: "ge" | "jr";
  name: string;
  /** What the business is, in one sentence. */
  line: string;
  /** Our role, in one sentence. */
  role: string;
  url: string;
  domain: string;
  altUrl?: { href: string; label: string };
  screens: Screen[];
  tint: { field: string; ink: string };
  logo: { src: string; alt: string; width: number; height: number };
  /** Business context -> what we built -> how a customer arrives -> where it stands. */
  story: { context: string; built: string[]; flow: string[]; state: string };
  /** Public places the work can be checked. */
  links: { href: string; label: string }[];
  /** Real images from the client's own public page. */
  gallery: { src: string; alt: string; width: number; height: number }[];
};

export const intro = {
  title: "Customer-acquisition systems I built for clients through Presencia Studio.",
  line: "Two businesses in Guanacaste, Costa Rica: a page that sells, a path to a conversation, and the tooling behind it.",
  ownProducts: "Presencia Studio and Listo are products I founded; they are on the home page.",
};

export const cases: ClientCase[] = [
  {
    id: "ge",
    name: "Guanacaste Earthmoving",
    line: "Heavy equipment with operator and earthmoving contract work across Guanacaste.",
    role: "Brand site, acquisition page and WhatsApp quoting flow, designed and built through Presencia Studio.",
    url: "https://www.presencia.studio/p/ge",
    domain: "presencia.studio/p/ge",
    altUrl: { href: "https://www.presencia.studio/p/ge/en", label: "English version" },
    screens: [
      { src: "/work/customer-acquisition/ge/ge-es-home.webp", label: "Home, Spanish" },
      { src: "/work/customer-acquisition/ge/ge-es-quiz.webp", label: "Two taps, then WhatsApp" },
      { src: "/work/customer-acquisition/ge/ge-es-fleet.webp", label: "Fleet with spec sheets" },
      { src: "/work/customer-acquisition/ge/ge-es-projects.webp", label: "Real job photography" },
      { src: "/work/customer-acquisition/ge/ge-en-home.webp", label: "Home, English" },
    ],
    tint: { field: "#2a1409", ink: "#f6efe1" },
    logo: { src: "/work/customer-acquisition/ge/logo.webp", alt: "Guanacaste Earthmoving logo", width: 240, height: 240 },
    story: {
      context:
        "Lot owners, contractors and developers in Guanacaste who need a machine or a job quoted, most of them on a phone, from a Facebook or Google ad.",
      built: [
        "A bilingual landing page in the company's voice: services, the fleet with manufacturer spec sheets, coverage, and real job-site photography.",
        "A two-tap chooser (what you need, where it is) that writes the first WhatsApp message for the visitor; no form, no account.",
        "Every section ends in a WhatsApp button that opens a chat with Guanacaste Earthmoving directly, with the context already written.",
        "Page, scroll and chooser events reported to the Presencia dashboard, so demand by service and zone is read from behaviour, not guessed.",
      ],
      flow: ["Facebook or Google ad", "Landing page", "Two taps", "WhatsApp with GE", "GE quotes the job"],
      state:
        "Live in Spanish and English as of 17 October 2026. Quotes happen in the company's own WhatsApp; no customer figures are published here.",
    },
    links: [
      { href: "https://www.presencia.studio/p/ge", label: "Spanish page" },
      { href: "https://www.presencia.studio/p/ge/en", label: "English page" },
    ],
    gallery: [
      { src: "/work/customer-acquisition/ge/excavadora-villa.webp", alt: "Excavator working beside a villa in Guanacaste, from the Guanacaste Earthmoving page", width: 720, height: 540 },
      { src: "/work/customer-acquisition/ge/drenaje.webp", alt: "Drainage culvert excavation, from the Guanacaste Earthmoving page", width: 720, height: 540 },
    ],
  },
  {
    id: "jr",
    name: "JR Rodríguez",
    line: "Painter in Tamarindo, Costa Rica. Original commissions and existing work.",
    role: "Commission landing, inquiry intake and social channel, designed and built through Presencia Studio. The paintings are his.",
    url: "https://www.presencia.studio/jr-art-gallery",
    domain: "presencia.studio/jr-art-gallery",
    altUrl: { href: "https://www.presencia.studio/jr-art-gallery/es", label: "Versión en español" },
    screens: [
      { src: "/work/customer-acquisition/jr/jr-en-home.webp", label: "Home, English" },
      { src: "/work/customer-acquisition/jr/jr-en-work.webp", label: "The work" },
      { src: "/work/customer-acquisition/jr/jr-en-steps.webp", label: "The commission in four steps" },
      { src: "/work/customer-acquisition/jr/jr-en-inquiry.webp", label: "Formal inquiry" },
      { src: "/work/customer-acquisition/jr/jr-es-home.webp", label: "Home, Spanish" },
    ],
    tint: { field: "#f4f0e6", ink: "#17181a" },
    logo: { src: "/work/customer-acquisition/jr/mark.webp", alt: "JR Rodríguez mark", width: 193, height: 104 },
    story: {
      context:
        "An artist with a recognisable style and a gallery in Tamarindo, whose serious buyers write first and expect a formal reply.",
      built: [
        "A bilingual commission landing built around his real paintings, each with its own inquiry link, in his register rather than a gallery template.",
        "Two ways in: a WhatsApp conversation that Presencia qualifies first, and a formal inquiry form.",
        "The form lands in the Presencia inbox as an email thread; a person reads it, replies by email and hands the conversation to JR.",
        "A public Facebook page with posts that link back to the site, and ads pointed at the page.",
      ],
      flow: ["Facebook post or ad", "Commission page", "WhatsApp or formal inquiry", "Presencia qualifies", "JR and the buyer talk"],
      state:
        "Page, posts, inquiry inbox and ads live as of 17 October 2026. The campaign is new; no sale is attributed to it yet, and none is claimed here.",
    },
    links: [
      { href: "https://www.presencia.studio/jr-art-gallery", label: "Commission page" },
      { href: "https://juniorrodriguezartgallery.com", label: "JR's own gallery site" },
      { href: "https://www.instagram.com/artgallerycafejr/", label: "Instagram" },
    ],
    gallery: [
      { src: "/work/customer-acquisition/jr/moon-landing.webp", alt: "Painting by JR Rodríguez: an astronaut under an On Air sign and studio lights", width: 640, height: 774 },
      { src: "/work/customer-acquisition/jr/tiger-woods.webp", alt: "Painting by JR Rodríguez: a tiger in a white suit among trees", width: 640, height: 823 },
      { src: "/work/customer-acquisition/jr/surfing-pets.webp", alt: "Painting by JR Rodríguez: animals surfing under palm trees", width: 640, height: 779 },
    ],
  },
];

export const closing = {
  title: "Same hands, different jobs.",
  body: "Startup architecture work is under Startup Work. This page is the client side of Presencia Studio.",
};
