const nextConfig = {
  /* Development */
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: true,
  },

  /* Build & Compilation */
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  /* Image Optimization */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  /* Experimental Features */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    typedRoutes: true,
  },

  /* Headers & Security */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
