/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.linkareer.com',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.linkareer.com',
      },
    ],
  },
};

export default nextConfig;
