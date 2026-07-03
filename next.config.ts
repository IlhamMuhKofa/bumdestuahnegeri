import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["@whiskeysockets/baileys", "ws"],
};

export default nextConfig;
