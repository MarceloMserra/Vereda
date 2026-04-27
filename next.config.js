const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // desabilitado para deploy simples com npm start
}

module.exports = withPWA(nextConfig)
