/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Transpile the shared packages in the monorepo
  transpilePackages: ['@cnr/database'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: 'cnr-group-storage-demo.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'cnr-documents.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-2.amazonaws.com',
      },
    ],
  },

  // Rewrites: proxy /api calls to the Express backend during dev
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://api:4000/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
