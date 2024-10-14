/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  i18n: {
    locales: ['no', 'en'],
    defaultLocale: 'no',
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'memory', 
      };
    }
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
