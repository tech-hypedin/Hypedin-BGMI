import type { MetadataRoute } from 'next';

// Set NEXT_PUBLIC_SITE_URL to your production domain (e.g. https://bgmicampusmvp.com)
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/dashboard', '/login', '/application', '/api'],
        },
        sitemap: `${SITE}/sitemap.xml`,
    };
}
