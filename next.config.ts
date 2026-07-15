import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — episode data is fetched client-side from S3,
  // so publishing new episodes never requires a redeploy.
  output: "export",
};

export default nextConfig;
