/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  experimental: {
    turbotrace: {
      files: ['./src/app/auth/callback/page.options.js']
    }
  }
};

export default nextConfig;
