import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@jellysafe/design-system"],
  async rewrites() {
    const target = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
    if (!target) return [];
    return [
      { source: "/api/:path*", destination: `${target}/api/:path*` },
      { source: "/uploads/:path*", destination: `${target}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
