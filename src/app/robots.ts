import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/signal-room", "/api/"] },
    sitemap: "https://yenus.dev/sitemap.xml",
  };
}
