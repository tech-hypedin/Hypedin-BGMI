// import type { NextConfig } from "next";

// // Security headers for the public site + admin UI (Next/Vercel HTML/JS isn't covered
// // by the backend's Helmet). Tighten the CSP once all external origins are known.
// const securityHeaders = [
//   { key: 'X-Frame-Options', value: 'DENY' },
//   { key: 'X-Content-Type-Options', value: 'nosniff' },
//   { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
//   { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
//   // NOTE: HSTS + `upgrade-insecure-requests` are DISABLED while the site is served over
//   // plain HTTP (current IP-only phase). They force every asset to HTTPS and break the
//   // page when no certificate is present. RE-ENABLE BOTH once the domain + SSL are live:
//   //   { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
//   //   ...and add 'upgrade-insecure-requests' back to the CSP array below.
//   {
//     key: 'Content-Security-Policy',
//     value: [
//       "default-src 'self'",
//       // Next.js requires 'unsafe-inline' (and 'unsafe-eval' in dev) for hydration/runtime.
//       "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
//       "style-src 'self' 'unsafe-inline'",
//       "img-src 'self' data: blob: https:",
//       "font-src 'self' data:",
//       "media-src 'self'",
//       // Allow the API origin to be configured via env at build time.
//       `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || ''} https: wss:`.trim(),
//       "object-src 'none'",
//       "base-uri 'self'",
//       "frame-ancestors 'none'",
//       "form-action 'self'",
//       // 'upgrade-insecure-requests',  // RE-ENABLE once SSL is live (see note above)
//     ].join('; '),
//   },
// ];

// const nextConfig: NextConfig = {
//   allowedDevOrigins: ['localhost:5173', '192.168.1.19'],
//   output: 'standalone',
//   poweredByHeader: false,
//   async headers() {
//     return [{ source: '/:path*', headers: securityHeaders }];
//   },
// };

// export default nextConfig;



// Security headers for the public site + admin UI
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "media-src 'self'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || ''} https: wss:`.trim(),
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  allowedDevOrigins: ['localhost:5173', '192.168.1.19'],
  output: 'standalone',
  poweredByHeader: false,

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;