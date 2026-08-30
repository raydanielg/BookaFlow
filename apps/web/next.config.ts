import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async rewrites() {
    return [
      {
        source: "/@:slug",
        destination: "/p/:slug",
      },
    ]
  },
}

export default nextConfig
