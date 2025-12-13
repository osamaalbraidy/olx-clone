/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.olx.com.lb',
      },
      {
        protocol: 'https',
        hostname: 'images.olx.com.lb',
      },
    ],
  },
};

module.exports = nextConfig;
