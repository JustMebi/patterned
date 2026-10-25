import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@patterned/measurement-engine",
    "@patterned/garment-schema",
    "@patterned/fabric-catalogue",
    "@patterned/entitlements",
  ],
};

export default nextConfig;
