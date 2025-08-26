/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // Configuración de Next.js
  reactStrictMode: true,
  // Configuración de compilación
  compiler: {
    styledComponents: true,
  },
  // Configuración de imágenes
  images: {
    domains: [],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },
  // Configuración de encabezados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

// Configuración de PWA
const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\.(woff|woff2|ttf|eot)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ['!noprecache/**/*'],
  disableDevLogs: true,
  dynamicStartUrl: true,
  reloadOnOnline: true,
};

// Aplicar PWA solo en producción
const config = process.env.NODE_ENV === 'development' 
  ? nextConfig 
  : withPWA(pwaConfig)(nextConfig);

export default config;