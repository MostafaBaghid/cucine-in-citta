import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Il brief indica firebasestorage.googleapis.com, ma le risposte reali
    // dell'API servono image_emoji da storage.googleapis.com (bucket
    // bestie-bite.appspot.com) — vedi scripts/check-cors.mjs. Teniamo entrambi.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/bestie-bite.appspot.com/**",
      },
    ],
  },
};

export default nextConfig;
