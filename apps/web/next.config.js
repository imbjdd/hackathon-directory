/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/images",
      },
    ],
    qualities: [60, 75],
  },
};

export default nextConfig;
