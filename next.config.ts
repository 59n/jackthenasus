import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
      // Ensure any client-side admin routes (hash or nested) map to
      // the static admin files in `public/admin` so the CMS router
      // never returns a Next 404 for admin subpaths.
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
      {
        source: "/config.yml",
        destination: "/admin/config.yml",
      },
    ];
  },
};

export default nextConfig;
