/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable the 'x-powered-by: Next.js' header for security
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      }
    ],
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["react", "lucide-react", "recharts"],
  },
  // Enable React Strict Mode for enhanced development checks
  reactStrictMode: true
}

export default nextConfig
