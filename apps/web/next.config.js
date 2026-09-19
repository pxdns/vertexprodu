/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  transpilePackages: ["@vertex/database"],
  webpack: (config, { isServer }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src")
    return config
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
}

module.exports = nextConfig
