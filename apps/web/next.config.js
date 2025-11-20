/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@repo/database'],
};

module.exports = nextConfig;
