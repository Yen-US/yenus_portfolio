import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/Yenson_Umana_Resume.pdf",
        destination: "/yenson-ai-resume.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
