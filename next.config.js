/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/pricing",
        destination: "/",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/",
        permanent: false,
      },
      {
        source: "/success",
        destination: "/",
        permanent: false,
      },
      {
        source: "/auth/error",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
