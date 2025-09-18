import { type NextConfig } from "next/types";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { createSecureHeaders } from "next-secure-headers";

const INTERNAL_PACKAGES = ["@workspace/ui"];

const nextConfig: NextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: INTERNAL_PACKAGES,
  serverExternalPackages: [],
  /** Force single Three.js instance to prevent duplicate imports */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
    };
    return config;
  },
  experimental: {
    optimizePackageImports: [
      "recharts",
      "lucide-react",
      "date-fns",
      ...INTERNAL_PACKAGES,
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        locale: false,
        source: "/(.*)",
        headers: createSecureHeaders({
          frameGuard: "deny",
          noopen: "noopen",
          nosniff: "nosniff",
          xssProtection: "sanitize",
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: "same-origin",
        }),
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

const bundleAnalyzerConfig =
  process.env.ANALYZE === "true"
    ? withBundleAnalyzer({ enabled: true })(nextConfig)
    : nextConfig;

export default bundleAnalyzerConfig;
