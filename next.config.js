/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'papiphotos.remax-im.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
