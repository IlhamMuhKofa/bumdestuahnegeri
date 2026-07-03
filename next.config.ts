import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["@whiskeysockets/baileys", "ws"],

    eslint: {
        ignoreDuringBuilds: true,
    },

    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;