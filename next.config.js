const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals = [...config.externals, "hnswlib-node"]; // by adding this line, solved the import
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "gcevngqhykuaxuphcgxw.supabase.co",
      "api.producthunt.com",
      "localhost",
    ],
  },
};

module.exports = withContentlayer(nextConfig);
