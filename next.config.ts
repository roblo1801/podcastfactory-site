import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next build — Amplify hosts this as a WEB_COMPUTE app.
  // Episode data lives in public/ and is fetched client-side, so new
  // episodes only need the factory's publish commit, not a code change.
};

export default nextConfig;
