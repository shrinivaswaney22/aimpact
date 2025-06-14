/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'randomuser.me',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'cdn.sanity.io',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/**',
        },
        ],
    },
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['@sanity/client'],
    },
};

export default nextConfig;
