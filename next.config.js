/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // distDir: "_next",

  images: {
    domains: ['api.sameh-mall.com'], // Add this line to allow images from api.sameh-mall.com
  },
};

module.exports = nextConfig;
