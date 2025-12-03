
import type {NextConfig} from 'next';

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com;
  child-src 'self';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src * 'self' data:;
  media-src 'self';
  connect-src *;
  font-src 'self' fonts.gstatic.com;
`;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
