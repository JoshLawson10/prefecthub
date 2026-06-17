import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        // Supabase storage — covers avatars and any other public bucket URLs
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 4MB — raise to match the 10MB limit enforced in uploadDocument
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
