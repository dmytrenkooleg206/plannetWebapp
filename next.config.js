/** @type {import('next').NextConfig} */

const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'd3ihmv6b4e4rgv.cloudfront.net',
      'maps.googleapis.com',
      'dp4y5jvhqbaqo.cloudfront.net',
      'plannet-web-staging.herokuapp.com',
      'plannet.io',
      'www.kayak.com',
      'kayak.com',
      'media.travsrv.com',
      'd2573qu6qrjt8c.cloudfront.net',
      'hare-media-cdn.tripadvisor.com',
      'business-entity.s3.us-east-2.amazonaws.com',
      'plannet-profile-pictures.s3.amazonaws.com',
      'plannet-profile-pictures.s3.us-east-2.amazonaws.com',
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
