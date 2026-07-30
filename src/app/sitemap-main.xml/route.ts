export async function GET() {
  const baseUrl = 'https://ecomfind.vercel.app'

  const pages = [
    {
      url: baseUrl,
      priority: 1.0,
      changefreq: 'daily',
    },
    {
      url: `${baseUrl}/discover`,
      priority: 0.9,
      changefreq: 'daily',
    },
    {
      url: `${baseUrl}/bulk-audit`,
      priority: 0.9,
      changefreq: 'daily',
    },
    {
      url: `${baseUrl}/bulk`,
      priority: 0.8,
      changefreq: 'weekly',
    },
    {
      url: `${baseUrl}/privacy`,
      priority: 0.7,
      changefreq: 'monthly',
    },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}