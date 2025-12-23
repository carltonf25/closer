import { MetadataRoute } from 'next';
import { GEORGIA_CITIES, SERVICE_SLUGS } from '@/config/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://georgiahomeservices.com';

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // City index page
  routes.push({
    url: `${baseUrl}/locations`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Service index pages
  routes.push({
    url: `${baseUrl}/services/hvac`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  routes.push({
    url: `${baseUrl}/services/plumbing`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Generate all city/service combinations
  GEORGIA_CITIES.forEach(city => {
    Object.keys(SERVICE_SLUGS).forEach(serviceSlug => {
      routes.push({
        url: `${baseUrl}/${city.slug}/${serviceSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return routes;
}
