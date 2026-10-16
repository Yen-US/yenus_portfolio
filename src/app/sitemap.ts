import type { MetadataRoute } from "next";

const base = "https://yenus.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/cv", "/consulting", "/services", "/work", "/about", "/discovery"].map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/cv" ? 0.9 : 0.6,
  }));
}
