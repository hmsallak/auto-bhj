/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/fr", destination: "/", permanent: false }];
  },
};

module.exports = nextConfig;
