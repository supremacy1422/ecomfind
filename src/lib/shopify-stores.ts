export interface ShopifyStore {
  domain: string;
  shopifyDomain: string;
  email?: string;
  countryCode: string;
  country?: string;
  industry: string;
  products: number;
  score: number;
  createdAt: string;
}

export const SHOPIFY_STORES: ShopifyStore[] = [
  // North America
  { domain: "fashionnova.com", shopifyDomain: "fashionnova.myshopify.com", email: "contact@fashionnova.com", countryCode: "US", country: "United States", industry: "Fashion", products: 4500, score: 88, createdAt: "2013-06-15T00:00:00Z" },
  { domain: "gymshark.com", shopifyDomain: "gymshark.myshopify.com", email: "support@gymshark.com", countryCode: "GB", country: "United Kingdom", industry: "Fitness", products: 320, score: 92, createdAt: "2012-08-01T00:00:00Z" },
  { domain: "allbirds.com", shopifyDomain: "allbirds.myshopify.com", email: "hello@allbirds.com", countryCode: "US", country: "United States", industry: "Fashion", products: 45, score: 85, createdAt: "2015-03-10T00:00:00Z" },
  { domain: "glossier.com", shopifyDomain: "glossier.myshopify.com", email: "press@glossier.com", countryCode: "US", country: "United States", industry: "Beauty", products: 120, score: 90, createdAt: "2014-01-20T00:00:00Z" },
  { domain: "mvmt.com", shopifyDomain: "mvmt.myshopify.com", email: "hello@mvmt.com", countryCode: "US", country: "United States", industry: "Jewelry", products: 85, score: 78, createdAt: "2013-11-05T00:00:00Z" },
  { domain: "bombas.com", shopifyDomain: "bombas.myshopify.com", email: "help@bombas.com", countryCode: "US", country: "United States", industry: "Fashion", products: 200, score: 82, createdAt: "2013-04-12T00:00:00Z" },
  { domain: "brooklinen.com", shopifyDomain: "brooklinen.myshopify.com", email: "hello@brooklinen.com", countryCode: "US", country: "United States", industry: "Home", products: 150, score: 80, createdAt: "2014-07-22T00:00:00Z" },
  { domain: "mejuri.com", shopifyDomain: "mejuri.myshopify.com", email: "care@mejuri.com", countryCode: "CA", country: "Canada", industry: "Jewelry", products: 300, score: 86, createdAt: "2015-09-01T00:00:00Z" },
  { domain: "kotn.com", shopifyDomain: "kotn.myshopify.com", email: "hello@kotn.com", countryCode: "CA", country: "Canada", industry: "Fashion", products: 80, score: 79, createdAt: "2015-01-15T00:00:00Z" },
  { domain: "chubbies.com", shopifyDomain: "chubbies.myshopify.com", email: "support@chubbies.com", countryCode: "US", country: "United States", industry: "Fashion", products: 250, score: 75, createdAt: "2012-06-01T00:00:00Z" },
  { domain: "honest.com", shopifyDomain: "honest.myshopify.com", email: "support@honest.com", countryCode: "US", country: "United States", industry: "Beauty", products: 400, score: 83, createdAt: "2012-01-10T00:00:00Z" },
  { domain: "awaytravel.com", shopifyDomain: "away.myshopify.com", email: "help@awaytravel.com", countryCode: "US", country: "United States", industry: "Home", products: 35, score: 87, createdAt: "2015-11-09T00:00:00Z" },
  { domain: "rapha.cc", shopifyDomain: "rapha.myshopify.com", email: "support@rapha.cc", countryCode: "GB", country: "United Kingdom", industry: "Fitness", products: 600, score: 91, createdAt: "2004-01-01T00:00:00Z" },
  { domain: "colourpop.com", shopifyDomain: "colourpop.myshopify.com", email: "support@colourpop.com", countryCode: "US", country: "United States", industry: "Beauty", products: 800, score: 84, createdAt: "2014-05-20T00:00:00Z" },
  { domain: "nativecos.com", shopifyDomain: "native.myshopify.com", email: "hello@nativecos.com", countryCode: "US", country: "United States", industry: "Beauty", products: 45, score: 81, createdAt: "2015-07-15T00:00:00Z" },
  { domain: "curology.com", shopifyDomain: "curology.myshopify.com", email: "support@curology.com", countryCode: "US", country: "United States", industry: "Beauty", products: 12, score: 89, createdAt: "2014-09-01T00:00:00Z" },
  { domain: "helixsleep.com", shopifyDomain: "helix.myshopify.com", email: "support@helixsleep.com", countryCode: "US", country: "United States", industry: "Home", products: 18, score: 77, createdAt: "2015-08-20T00:00:00Z" },
  { domain: "purple.com", shopifyDomain: "purple.myshopify.com", email: "support@purple.com", countryCode: "US", country: "United States", industry: "Home", products: 25, score: 85, createdAt: "2016-01-01T00:00:00Z" },
  { domain: "lumin.com", shopifyDomain: "lumin.myshopify.com", email: "hello@lumin.com", countryCode: "US", country: "United States", industry: "Beauty", products: 30, score: 73, createdAt: "2018-03-01T00:00:00Z" },

  // Western Europe
  { domain: "decathlon.fr", shopifyDomain: "decathlon-fr.myshopify.com", email: "contact@decathlon.fr", countryCode: "FR", country: "France", industry: "Fitness", products: 5000, score: 94, createdAt: "1976-07-01T00:00:00Z" },
  { domain: "zara.com", shopifyDomain: "zara.myshopify.com", email: "customerservice@zara.com", countryCode: "ES", country: "Spain", industry: "Fashion", products: 12000, score: 95, createdAt: "1975-05-01T00:00:00Z" },
  { domain: "asos.com", shopifyDomain: "asos.myshopify.com", email: "help@asos.com", countryCode: "GB", country: "United Kingdom", industry: "Fashion", products: 85000, score: 93, createdAt: "2000-06-01T00:00:00Z" },
  { domain: "hm.com", shopifyDomain: "hm.myshopify.com", email: "customerservice@hm.com", countryCode: "SE", country: "Sweden", industry: "Fashion", products: 25000, score: 92, createdAt: "1947-01-01T00:00:00Z" },
  { domain: "ikea.com", shopifyDomain: "ikea.myshopify.com", email: "customerservice@ikea.com", countryCode: "SE", country: "Sweden", industry: "Home", products: 12000, score: 91, createdAt: "1943-07-28T00:00:00Z" },
  { domain: "swarovski.com", shopifyDomain: "swarovski.myshopify.com", email: "service@swarovski.com", countryCode: "AT", country: "Austria", industry: "Jewelry", products: 3500, score: 88, createdAt: "1895-01-01T00:00:00Z" },
  { domain: "rituals.com", shopifyDomain: "rituals.myshopify.com", email: "service@rituals.com", countryCode: "NL", country: "Netherlands", industry: "Beauty", products: 800, score: 87, createdAt: "2000-01-01T00:00:00Z" },
  { domain: "douglas.de", shopifyDomain: "douglas.myshopify.com", email: "service@douglas.de", countryCode: "DE", country: "Germany", industry: "Beauty", products: 35000, score: 90, createdAt: "1821-01-01T00:00:00Z" },
  { domain: "nike.com", shopifyDomain: "nike.myshopify.com", email: "support@nike.com", countryCode: "NL", country: "Netherlands", industry: "Fitness", products: 45000, score: 96, createdAt: "1964-01-25T00:00:00Z" },
  { domain: "adidas.de", shopifyDomain: "adidas.myshopify.com", email: "service@adidas.de", countryCode: "DE", country: "Germany", industry: "Fitness", products: 28000, score: 95, createdAt: "1949-08-18T00:00:00Z" },
  { domain: "cosstores.com", shopifyDomain: "cos.myshopify.com", email: "customerservice@cosstores.com", countryCode: "SE", country: "Sweden", industry: "Fashion", products: 3000, score: 89, createdAt: "2007-01-01T00:00:00Z" },
  { domain: "muji.net", shopifyDomain: "muji.myshopify.com", email: "info@muji.net", countryCode: "JP", country: "Japan", industry: "Home", products: 7000, score: 88, createdAt: "1980-01-01T00:00:00Z" },
  { domain: "uniqlo.com", shopifyDomain: "uniqlo.myshopify.com", email: "service@uniqlo.com", countryCode: "JP", country: "Japan", industry: "Fashion", products: 20000, score: 94, createdAt: "1949-03-01T00:00:00Z" },
  { domain: "gucci.com", shopifyDomain: "gucci.myshopify.com", email: "client.service@gucci.com", countryCode: "IT", country: "Italy", industry: "Fashion", products: 5000, score: 93, createdAt: "1921-01-01T00:00:00Z" },
  { domain: "prada.com", shopifyDomain: "prada.myshopify.com", email: "client.service@prada.com", countryCode: "IT", country: "Italy", industry: "Fashion", products: 4000, score: 92, createdAt: "1913-01-01T00:00:00Z" },
  { domain: "hermes.com", shopifyDomain: "hermes.myshopify.com", email: "service@hermes.com", countryCode: "FR", country: "France", industry: "Fashion", products: 3000, score: 97, createdAt: "1837-01-01T00:00:00Z" },
  { domain: "louisvuitton.com", shopifyDomain: "lv.myshopify.com", email: "service@louisvuitton.com", countryCode: "FR", country: "France", industry: "Fashion", products: 4500, score: 96, createdAt: "1854-01-01T00:00:00Z" },
  { domain: "chanel.com", shopifyDomain: "chanel.myshopify.com", email: "service@chanel.com", countryCode: "FR", country: "France", industry: "Beauty", products: 2500, score: 98, createdAt: "1910-01-01T00:00:00Z" },
  { domain: "dior.com", shopifyDomain: "dior.myshopify.com", email: "service@dior.com", countryCode: "FR", country: "France", industry: "Beauty", products: 3500, score: 95, createdAt: "1946-12-16T00:00:00Z" },

  // Asia-Pacific
  { domain: "xiaomi.com", shopifyDomain: "xiaomi.myshopify.com", email: "service@xiaomi.com", countryCode: "CN", country: "China", industry: "Electronics", products: 500, score: 91, createdAt: "2010-04-06T00:00:00Z" },
  { domain: "miniso.com", shopifyDomain: "miniso.myshopify.com", email: "service@miniso.com", countryCode: "CN", country: "China", industry: "Home", products: 8000, score: 82, createdAt: "2013-01-01T00:00:00Z" },
  { domain: "shein.com", shopifyDomain: "shein.myshopify.com", email: "service@shein.com", countryCode: "CN", country: "China", industry: "Fashion", products: 600000, score: 89, createdAt: "2008-01-01T00:00:00Z" },
  { domain: "cottonon.com", shopifyDomain: "cottonon.myshopify.com", email: "customerservice@cottonon.com", countryCode: "AU", country: "Australia", industry: "Fashion", products: 12000, score: 85, createdAt: "1991-01-01T00:00:00Z" },
  { domain: "theiconic.com.au", shopifyDomain: "theiconic.myshopify.com", email: "care@theiconic.com.au", countryCode: "AU", country: "Australia", industry: "Fashion", products: 60000, score: 88, createdAt: "2011-10-01T00:00:00Z" },
  { domain: "mecca.com.au", shopifyDomain: "mecca.myshopify.com", email: "online@mecca.com.au", countryCode: "AU", country: "Australia", industry: "Beauty", products: 8000, score: 87, createdAt: "1997-01-01T00:00:00Z" },
  { domain: "kmart.co.nz", shopifyDomain: "kmart-nz.myshopify.com", email: "customer.services@kmart.co.nz", countryCode: "NZ", country: "New Zealand", industry: "Home", products: 15000, score: 81, createdAt: "1969-01-01T00:00:00Z" },
  { domain: "muji.com", shopifyDomain: "muji-jp.myshopify.com", email: "info@muji.com", countryCode: "JP", country: "Japan", industry: "Home", products: 7000, score: 88, createdAt: "1980-01-01T00:00:00Z" },
  { domain: "shiseido.com", shopifyDomain: "shiseido.myshopify.com", email: "support@shiseido.com", countryCode: "JP", country: "Japan", industry: "Beauty", products: 2500, score: 92, createdAt: "1872-01-01T00:00:00Z" },
  { domain: "innisfree.com", shopifyDomain: "innisfree.myshopify.com", email: "support@innisfree.com", countryCode: "KR", country: "South Korea", industry: "Beauty", products: 1200, score: 86, createdAt: "2000-01-01T00:00:00Z" },
  { domain: "laneige.com", shopifyDomain: "laneige.myshopify.com", email: "support@laneige.com", countryCode: "KR", country: "South Korea", industry: "Beauty", products: 600, score: 85, createdAt: "1994-01-01T00:00:00Z" },
  { domain: "lazada.sg", shopifyDomain: "lazada.myshopify.com", email: "support@lazada.sg", countryCode: "SG", country: "Singapore", industry: "Electronics", products: 500000, score: 90, createdAt: "2012-01-01T00:00:00Z" },
  { domain: "shopee.sg", shopifyDomain: "shopee.myshopify.com", email: "support@shopee.sg", countryCode: "SG", country: "Singapore", industry: "Fashion", products: 1000000, score: 91, createdAt: "2015-01-01T00:00:00Z" },
  { domain: "watsons.com.tw", shopifyDomain: "watsons.myshopify.com", email: "service@watsons.com.tw", countryCode: "TW", country: "Taiwan", industry: "Beauty", products: 18000, score: 84, createdAt: "1828-01-01T00:00:00Z" },

  // Middle East
  { domain: "namshi.com", shopifyDomain: "namshi.myshopify.com", email: "support@namshi.com", countryCode: "AE", country: "United Arab Emirates", industry: "Fashion", products: 25000, score: 86, createdAt: "2011-01-01T00:00:00Z" },
  { domain: "6thstreet.com", shopifyDomain: "6thstreet.myshopify.com", email: "care@6thstreet.com", countryCode: "AE", country: "United Arab Emirates", industry: "Fashion", products: 15000, score: 83, createdAt: "2016-01-01T00:00:00Z" },
  { domain: "ounass.com", shopifyDomain: "ounass.myshopify.com", email: "support@ounass.com", countryCode: "AE", country: "United Arab Emirates", industry: "Fashion", products: 8000, score: 85, createdAt: "2016-01-01T00:00:00Z" },
  { domain: "noon.com", shopifyDomain: "noon.myshopify.com", email: "support@noon.com", countryCode: "AE", country: "United Arab Emirates", industry: "Electronics", products: 200000, score: 88, createdAt: "2017-01-01T00:00:00Z" },
  { domain: "sivvi.com", shopifyDomain: "sivvi.myshopify.com", email: "support@sivvi.com", countryCode: "AE", country: "United Arab Emirates", industry: "Fashion", products: 12000, score: 82, createdAt: "2014-01-01T00:00:00Z" },
  { domain: "themodist.com", shopifyDomain: "themodist.myshopify.com", email: "hello@themodist.com", countryCode: "AE", country: "United Arab Emirates", industry: "Fashion", products: 3000, score: 80, createdAt: "2017-01-01T00:00:00Z" },

  // South America
  { domain: "mercadolibre.com", shopifyDomain: "mercadolibre.myshopify.com", email: "atencion@mercadolibre.com", countryCode: "AR", country: "Argentina", industry: "Electronics", products: 500000, score: 90, createdAt: "1999-01-01T00:00:00Z" },
  { domain: "dafiti.com.br", shopifyDomain: "dafiti.myshopify.com", email: "faleconosco@dafiti.com.br", countryCode: "BR", country: "Brazil", industry: "Fashion", products: 80000, score: 85, createdAt: "2011-01-01T00:00:00Z" },
  { domain: "netshoes.com.br", shopifyDomain: "netshoes.myshopify.com", email: "sac@netshoes.com.br", countryCode: "BR", country: "Brazil", industry: "Fitness", products: 45000, score: 87, createdAt: "2000-01-01T00:00:00Z" },
  { domain: "falabella.com", shopifyDomain: "falabella.myshopify.com", email: "serviciocliente@falabella.com", countryCode: "CL", country: "Chile", industry: "Home", products: 60000, score: 88, createdAt: "1889-01-01T00:00:00Z" },
  { domain: "linio.com", shopifyDomain: "linio.myshopify.com", email: "servicio@linio.com", countryCode: "MX", country: "Mexico", industry: "Electronics", products: 120000, score: 84, createdAt: "2012-01-01T00:00:00Z" },

  // Africa
  { domain: "jumia.com.ng", shopifyDomain: "jumia-ng.myshopify.com", email: "support@jumia.com.ng", countryCode: "NG", country: "Nigeria", industry: "Electronics", products: 200000, score: 83, createdAt: "2012-01-01T00:00:00Z" },
  { domain: "takealot.com", shopifyDomain: "takealot.myshopify.com", email: "support@takealot.com", countryCode: "ZA", country: "South Africa", industry: "Electronics", products: 150000, score: 86, createdAt: "2011-01-01T00:00:00Z" },
  { domain: "superbalist.com", shopifyDomain: "superbalist.myshopify.com", email: "support@superbalist.com", countryCode: "ZA", country: "South Africa", industry: "Fashion", products: 25000, score: 84, createdAt: "2013-01-01T00:00:00Z" },
  { domain: "zando.co.za", shopifyDomain: "zando.myshopify.com", email: "support@zando.co.za", countryCode: "ZA", country: "South Africa", industry: "Fashion", products: 18000, score: 81, createdAt: "2012-01-01T00:00:00Z" },

  // South Asia
  { domain: "flipkart.com", shopifyDomain: "flipkart.myshopify.com", email: "support@flipkart.com", countryCode: "IN", country: "India", industry: "Electronics", products: 800000, score: 91, createdAt: "2007-01-01T00:00:00Z" },
  { domain: "myntra.com", shopifyDomain: "myntra.myshopify.com", email: "support@myntra.com", countryCode: "IN", country: "India", industry: "Fashion", products: 350000, score: 89, createdAt: "2007-01-01T00:00:00Z" },
  { domain: "nykaa.com", shopifyDomain: "nykaa.myshopify.com", email: "support@nykaa.com", countryCode: "IN", country: "India", industry: "Beauty", products: 120000, score: 87, createdAt: "2012-01-01T00:00:00Z" },
  { domain: "daraz.pk", shopifyDomain: "daraz.myshopify.com", email: "support@daraz.pk", countryCode: "PK", country: "Pakistan", industry: "Fashion", products: 200000, score: 82, createdAt: "2012-01-01T00:00:00Z" },
  { domain: "pickaboo.com", shopifyDomain: "pickaboo.myshopify.com", email: "support@pickaboo.com", countryCode: "BD", country: "Bangladesh", industry: "Electronics", products: 8000, score: 79, createdAt: "2016-01-01T00:00:00Z" },

  // Southeast Asia
  { domain: "tokopedia.com", shopifyDomain: "tokopedia.myshopify.com", email: "support@tokopedia.com", countryCode: "ID", country: "Indonesia", industry: "Electronics", products: 9000000, score: 90, createdAt: "2009-01-01T00:00:00Z" },
  { domain: "bukalapak.com", shopifyDomain: "bukalapak.myshopify.com", email: "support@bukalapak.com", countryCode: "ID", country: "Indonesia", industry: "Fashion", products: 4000000, score: 86, createdAt: "2010-01-01T00:00:00Z" },
  { domain: "zalora.com", shopifyDomain: "zalora.myshopify.com", email: "support@zalora.com", countryCode: "MY", country: "Malaysia", industry: "Fashion", products: 50000, score: 85, createdAt: "2012-01-01T00:00:00Z" },
  { domain: "central.co.th", shopifyDomain: "central.myshopify.com", email: "contact@central.co.th", countryCode: "TH", country: "Thailand", industry: "Home", products: 80000, score: 87, createdAt: "1947-01-01T00:00:00Z" },
  { domain: "tiki.vn", shopifyDomain: "tiki.myshopify.com", email: "hotro@tiki.vn", countryCode: "VN", country: "Vietnam", industry: "Electronics", products: 300000, score: 88, createdAt: "2010-01-01T00:00:00Z" },
  { domain: "sendo.vn", shopifyDomain: "sendo.myshopify.com", email: "hotro@sendo.vn", countryCode: "VN", country: "Vietnam", industry: "Fashion", products: 150000, score: 84, createdAt: "2012-01-01T00:00:00Z" },

  // Eastern Europe
  { domain: "wildberries.ru", shopifyDomain: "wildberries.myshopify.com", email: "support@wildberries.ru", countryCode: "RU", country: "Russia", industry: "Fashion", products: 2000000, score: 89, createdAt: "2004-01-01T00:00:00Z" },
  { domain: "ozon.ru", shopifyDomain: "ozon.myshopify.com", email: "support@ozon.ru", countryCode: "RU", country: "Russia", industry: "Electronics", products: 1500000, score: 90, createdAt: "1998-01-01T00:00:00Z" },
  { domain: "allegro.pl", shopifyDomain: "allegro.myshopify.com", email: "pomoc@allegro.pl", countryCode: "PL", country: "Poland", industry: "Electronics", products: 300000, score: 91, createdAt: "1999-01-01T00:00:00Z" },
  { domain: "emag.ro", shopifyDomain: "emag.myshopify.com", email: "relatiiclienti@emag.ro", countryCode: "RO", country: "Romania", industry: "Electronics", products: 200000, score: 87, createdAt: "2001-01-01T00:00:00Z" },
  { domain: "heureka.cz", shopifyDomain: "heureka.myshopify.com", email: "podpora@heureka.cz", countryCode: "CZ", country: "Czech Republic", industry: "Electronics", products: 50000, score: 85, createdAt: "2007-01-01T00:00:00Z" },
];

export function searchStores(query: string, countryCode?: string, industry?: string, minProducts?: number, maxProducts?: number, fromDate?: string, toDate?: string) {
  let results = [...SHOPIFY_STORES];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s => 
      s.domain.toLowerCase().includes(q) || 
      s.country?.toLowerCase().includes(q) || 
      s.industry.toLowerCase().includes(q)
    );
  }

  if (countryCode && countryCode !== "all") {
    results = results.filter(s => s.countryCode === countryCode);
  }

  if (industry && industry !== "all") {
    results = results.filter(s => s.industry === industry);
  }

  if (minProducts !== undefined) {
    results = results.filter(s => s.products >= minProducts);
  }

  if (maxProducts !== undefined) {
    results = results.filter(s => s.products <= maxProducts);
  }

  if (fromDate) {
    const from = new Date(fromDate).getTime();
    results = results.filter(s => new Date(s.createdAt).getTime() >= from);
  }

  if (toDate) {
    const to = new Date(toDate).getTime();
    results = results.filter(s => new Date(s.createdAt).getTime() <= to);
  }

  return results;
}