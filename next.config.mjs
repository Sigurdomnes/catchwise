/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { dev }) => {
      if (dev) {
        config.cache = {
          type: 'memory', // Use memory caching in development
        };
      }
      return config;
    },
  };
export default nextConfig;
