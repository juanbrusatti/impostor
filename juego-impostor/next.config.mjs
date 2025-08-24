/** @type {import('next').NextConfig} */
const nextConfig = {};

import withPWA from 'next-pwa'

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  reactStrictMode: true,
})

  