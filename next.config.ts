import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "libraryapis.nitg-eg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3100",
    "https://libraryapis.nitg-eg.com",
  ],
  
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
