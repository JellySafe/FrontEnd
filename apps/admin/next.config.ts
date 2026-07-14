import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
let apiHostname: string | null = null;
try {
  if (apiUrl) apiHostname = new URL(apiUrl).hostname;
} catch {
  /* ignore */
}

const nextConfig: NextConfig = {
  transpilePackages: ["@jellysafe/design-system"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "demo.jellysafe.local", pathname: "/**" },
      ...(apiHostname
        ? [{ protocol: "https" as const, hostname: apiHostname, pathname: "/**" }]
        : []),
    ],
  },
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
