import path from "path";
import { NextConfig } from "next";
import { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config: Configuration) {
    config.cache = {
      type: "filesystem",
      cacheDirectory: path.resolve("G:/npm-cache"),
    } as Configuration['cache'];
    return config;
  },
};

export default nextConfig;
