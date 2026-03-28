/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Privy imports optional Farcaster/Solana packages that aren't installed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@farcaster/mini-app-solana": false,
    };
    return config;
  },
};

export default nextConfig;
