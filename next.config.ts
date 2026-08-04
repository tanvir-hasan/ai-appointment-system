/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sgvxqjwztklgzilqxuso.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;