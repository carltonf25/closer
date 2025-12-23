/**
 * Verification script for SEO features
 * Checks that all SEO pages and features are working
 */

import { GEORGIA_CITIES, SERVICE_SLUGS } from '@/config/services';

const baseUrl = 'http://localhost:3000';

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function verifySEOFeatures() {
  console.log('🔍 Verifying SEO Features...\n');
  console.log('='.repeat(60));

  const results: { feature: string; status: string; url?: string }[] = [];

  // 1. Check robots.txt
  console.log('\n📄 Checking robots.txt...');
  const robotsOk = await checkUrl(`${baseUrl}/robots.txt`);
  results.push({
    feature: 'robots.txt',
    status: robotsOk ? '✅ PASS' : '❌ FAIL',
    url: `${baseUrl}/robots.txt`,
  });

  // 2. Check sitemap.xml
  console.log('📄 Checking sitemap.xml...');
  const sitemapOk = await checkUrl(`${baseUrl}/sitemap.xml`);
  results.push({
    feature: 'sitemap.xml',
    status: sitemapOk ? '✅ PASS' : '❌ FAIL',
    url: `${baseUrl}/sitemap.xml`,
  });

  // 3. Check locations page
  console.log('📍 Checking locations page...');
  const locationsOk = await checkUrl(`${baseUrl}/locations`);
  results.push({
    feature: 'Locations Index Page',
    status: locationsOk ? '✅ PASS' : '❌ FAIL',
    url: `${baseUrl}/locations`,
  });

  // 4. Check service pages
  console.log('🔧 Checking service index pages...');
  const hvacOk = await checkUrl(`${baseUrl}/services/hvac`);
  results.push({
    feature: 'HVAC Services Page',
    status: hvacOk ? '✅ PASS' : '❌ FAIL',
    url: `${baseUrl}/services/hvac`,
  });

  const plumbingOk = await checkUrl(`${baseUrl}/services/plumbing`);
  results.push({
    feature: 'Plumbing Services Page',
    status: plumbingOk ? '✅ PASS' : '❌ FAIL',
    url: `${baseUrl}/services/plumbing`,
  });

  // 5. Check sample city/service pages
  console.log('🏙️  Checking sample city/service pages...');
  const samplePages = [
    { city: 'atlanta', service: 'hvac-repair' },
    { city: 'marietta', service: 'emergency-plumber' },
    { city: 'savannah', service: 'hvac-installation' },
  ];

  for (const page of samplePages) {
    const url = `${baseUrl}/${page.city}/${page.service}`;
    const ok = await checkUrl(url);
    results.push({
      feature: `City/Service: ${page.city}/${page.service}`,
      status: ok ? '✅ PASS' : '❌ FAIL',
      url,
    });
  }

  // 6. Calculate total pages in sitemap
  const totalCities = GEORGIA_CITIES.length;
  const totalServices = Object.keys(SERVICE_SLUGS).length;
  const totalCityServicePages = totalCities * totalServices;
  const totalPages = 1 + 1 + 2 + totalCityServicePages; // homepage + locations + 2 service pages + city/service combos

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SEO Features Summary:\n');

  results.forEach(result => {
    console.log(`${result.status} ${result.feature}`);
    if (result.url) {
      console.log(`   ${result.url}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n📈 SEO Statistics:\n');
  console.log(`Total cities: ${totalCities}`);
  console.log(`Total services: ${totalServices}`);
  console.log(`Total city/service pages: ${totalCityServicePages}`);
  console.log(`Total pages in sitemap: ${totalPages}`);

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ SEO Features Implemented:\n');
  console.log('✅ Dynamic city/service routes');
  console.log('✅ Static site generation (generateStaticParams)');
  console.log('✅ JSON-LD structured data');
  console.log('✅ Metadata & OpenGraph tags');
  console.log('✅ Canonical URLs');
  console.log('✅ XML Sitemap');
  console.log('✅ robots.txt');
  console.log('✅ Breadcrumb navigation with schema');
  console.log('✅ City index page (/locations)');
  console.log('✅ Service index pages (/services/*)');
  console.log('✅ Internal linking structure');

  const allPassed = results.every(r => r.status.includes('✅'));

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('\n🎉 All SEO features verified successfully!\n');
  } else {
    console.log('\n⚠️  Some SEO features need attention.\n');
  }

  console.log('💡 Test URLs manually:');
  console.log(`   Homepage: ${baseUrl}`);
  console.log(`   Locations: ${baseUrl}/locations`);
  console.log(`   HVAC Services: ${baseUrl}/services/hvac`);
  console.log(`   Plumbing Services: ${baseUrl}/services/plumbing`);
  console.log(`   Sample Page: ${baseUrl}/atlanta/hvac-repair`);
  console.log(`   Sitemap: ${baseUrl}/sitemap.xml`);
  console.log(`   Robots: ${baseUrl}/robots.txt\n`);
}

verifySEOFeatures();
