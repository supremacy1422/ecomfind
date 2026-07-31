export interface StoreRecord {
  domain: string;
  store_name: string;
  email: string;
  country: string;
  countryCode: string;
  industry: string;
  products: number;
  score: number;
  createdAt: string; // ISO date string
}

export const SHOPIFY_STORES: StoreRecord[] = [
  { domain: "fashionnova.com", store_name: "Fashion Nova", email: "support@fashionnova.com", country: "United States", countryCode: "US", industry: "Fashion", products: 4500, score: 82, createdAt: "2014-03-15" },
  { domain: "gymshark.com", store_name: "Gymshark", email: "support@gymshark.com", country: "United Kingdom", countryCode: "GB", industry: "Fitness", products: 320, score: 88, createdAt: "2012-06-20" },
  { domain: "allbirds.com", store_name: "Allbirds", email: "hello@allbirds.com", country: "United States", countryCode: "US", industry: "Fashion", products: 45, score: 85, createdAt: "2015-09-10" },
  { domain: "glossier.com", store_name: "Glossier", email: "press@glossier.com", country: "United States", countryCode: "US", industry: "Beauty", products: 89, score: 79, createdAt: "2014-01-22" },
  { domain: "mvmt.com", store_name: "MVMT Watches", email: "hello@mvmt.com", country: "United States", countryCode: "US", industry: "Jewelry", products: 156, score: 76, createdAt: "2013-07-08" },
  { domain: "bombas.com", store_name: "Bombas", email: "help@bombas.com", country: "United States", countryCode: "US", industry: "Fashion", products: 78, score: 81, createdAt: "2013-04-12" },
  { domain: "brooklinen.com", store_name: "Brooklinen", email: "hello@brooklinen.com", country: "United States", countryCode: "US", industry: "Home", products: 134, score: 77, createdAt: "2014-11-05" },
  { domain: "mejuri.com", store_name: "Mejuri", email: "care@mejuri.com", country: "Canada", countryCode: "CA", industry: "Jewelry", products: 210, score: 80, createdAt: "2015-02-28" },
  { domain: "kyliecosmetics.com", store_name: "Kylie Cosmetics", email: "support@kyliecosmetics.com", country: "United States", countryCode: "US", industry: "Beauty", products: 340, score: 83, createdAt: "2015-11-30" },
  { domain: "colourpop.com", store_name: "ColourPop", email: "support@colourpop.com", country: "United States", countryCode: "US", industry: "Beauty", products: 890, score: 78, createdAt: "2014-05-18" },
  { domain: "hismileteeth.com", store_name: "Hismile", email: "hello@hismileteeth.com", country: "Australia", countryCode: "AU", industry: "Beauty", products: 34, score: 74, createdAt: "2014-08-01" },
  { domain: "skims.com", store_name: "Skims", email: "support@skims.com", country: "United States", countryCode: "US", industry: "Fashion", products: 267, score: 86, createdAt: "2019-06-10" },
  { domain: "chubbieshorts.com", store_name: "Chubbies", email: "support@chubbieshorts.com", country: "United States", countryCode: "US", industry: "Fashion", products: 189, score: 72, createdAt: "2011-09-15" },
  { domain: "puravidabracelets.com", store_name: "Pura Vida", email: "support@puravidabracelets.com", country: "United States", countryCode: "US", industry: "Jewelry", products: 560, score: 75, createdAt: "2010-12-01" },
  { domain: "nativecos.com", store_name: "Native", email: "support@nativecos.com", country: "United States", countryCode: "US", industry: "Beauty", products: 45, score: 73, createdAt: "2015-07-20" },
  { domain: "awaytravel.com", store_name: "Away", email: "help@awaytravel.com", country: "United States", countryCode: "US", industry: "Home", products: 67, score: 84, createdAt: "2015-11-09" },
  { domain: "casper.com", store_name: "Casper", email: "support@casper.com", country: "United States", countryCode: "US", industry: "Home", products: 123, score: 79, createdAt: "2014-01-06" },
  { domain: "purple.com", store_name: "Purple", email: "support@purple.com", country: "United States", countryCode: "US", industry: "Home", products: 89, score: 76, createdAt: "2015-01-26" },
  { domain: "tuftandneedle.com", store_name: "Tuft & Needle", email: "support@tuftandneedle.com", country: "United States", countryCode: "US", industry: "Home", products: 45, score: 71, createdAt: "2012-10-01" },
  { domain: "helixsleep.com", store_name: "Helix Sleep", email: "support@helixsleep.com", country: "United States", countryCode: "US", industry: "Home", products: 34, score: 70, createdAt: "2015-06-15" },
  { domain: "nectarsleep.com", store_name: "Nectar Sleep", email: "support@nectarsleep.com", country: "United States", countryCode: "US", industry: "Home", products: 28, score: 69, createdAt: "2016-03-01" },
  { domain: "leesa.com", store_name: "Leesa", email: "support@leesa.com", country: "United States", countryCode: "US", industry: "Home", products: 23, score: 68, createdAt: "2014-09-01" },
  { domain: "brooklynbedding.com", store_name: "Brooklyn Bedding", email: "support@brooklynbedding.com", country: "United States", countryCode: "US", industry: "Home", products: 56, score: 67, createdAt: "2009-01-01" },
  { domain: "lull.com", store_name: "Lull", email: "support@lull.com", country: "United States", countryCode: "US", industry: "Home", products: 19, score: 66, createdAt: "2015-08-01" },
  { domain: "saatva.com", store_name: "Saatva", email: "support@saatva.com", country: "United States", countryCode: "US", industry: "Home", products: 78, score: 78, createdAt: "2010-12-01" },
  { domain: "amerisleep.com", store_name: "Amerisleep", email: "support@amerisleep.com", country: "United States", countryCode: "US", industry: "Home", products: 34, score: 65, createdAt: "2007-01-01" },
  { domain: "ghostbed.com", store_name: "GhostBed", email: "support@ghostbed.com", country: "United States", countryCode: "US", industry: "Home", products: 41, score: 64, createdAt: "2015-04-01" },
  { domain: "bearmattress.com", store_name: "Bear Mattress", email: "support@bearmattress.com", country: "United States", countryCode: "US", industry: "Home", products: 15, score: 63, createdAt: "2014-11-01" },
  { domain: "performancesleep.com", store_name: "Performance Sleep", email: "support@performancesleep.com", country: "United States", countryCode: "US", industry: "Home", products: 22, score: 62, createdAt: "2015-01-01" },
  { domain: "dormeo.com", store_name: "Dormeo", email: "support@dormeo.com", country: "United Kingdom", countryCode: "GB", industry: "Home", products: 67, score: 61, createdAt: "2002-01-01" },
  { domain: "simba-sleep.com", store_name: "Simba Sleep", email: "support@simba-sleep.com", country: "United Kingdom", countryCode: "GB", industry: "Home", products: 34, score: 73, createdAt: "2015-02-01" },
  { domain: "evemattress.co.uk", store_name: "Eve Mattress", email: "support@evemattress.co.uk", country: "United Kingdom", countryCode: "GB", industry: "Home", products: 28, score: 60, createdAt: "2015-01-01" },
  { domain: "otty.com", store_name: "Otty", email: "support@otty.com", country: "United Kingdom", countryCode: "GB", industry: "Home", products: 19, score: 59, createdAt: "2016-01-01" },
  { domain: "ergoflex.com.au", store_name: "Ergoflex", email: "support@ergoflex.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 12, score: 58, createdAt: "2006-01-01" },
  { domain: "macoda.com.au", store_name: "Macoda", email: "support@macoda.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 8, score: 57, createdAt: "2015-01-01" },
  { domain: "ecosa.com.au", store_name: "Ecosa", email: "support@ecosa.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 15, score: 69, createdAt: "2015-01-01" },
  { domain: "sleepingduck.com", store_name: "Sleeping Duck", email: "support@sleepingduck.com", country: "Australia", countryCode: "AU", industry: "Home", products: 9, score: 68, createdAt: "2014-01-01" },
  { domain: "noa.com.au", store_name: "Noa Home", email: "support@noa.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 23, score: 67, createdAt: "2016-01-01" },
  { domain: "onebed.com.au", store_name: "Onebed", email: "support@onebed.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 7, score: 56, createdAt: "2015-01-01" },
  { domain: "oneflo.com", store_name: "Oneflo", email: "support@oneflo.com", country: "Australia", countryCode: "AU", industry: "Home", products: 45, score: 55, createdAt: "2014-01-01" },
  { domain: "sommuto.com.au", store_name: "Sommuto", email: "support@sommuto.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 11, score: 54, createdAt: "2015-01-01" },
  { domain: "zenhaven.com", store_name: "Zenhaven", email: "support@zenhaven.com", country: "United States", countryCode: "US", industry: "Home", products: 6, score: 72, createdAt: "2016-01-01" },
  { domain: "plushbeds.com", store_name: "PlushBeds", email: "support@plushbeds.com", country: "United States", countryCode: "US", industry: "Home", products: 34, score: 71, createdAt: "2008-01-01" },
  { domain: "loomandleaf.com", store_name: "Loom & Leaf", email: "support@loomandleaf.com", country: "United States", countryCode: "US", industry: "Home", products: 8, score: 70, createdAt: "2015-01-01" },
  { domain: "mygreenmattress.com", store_name: "My Green Mattress", email: "support@mygreenmattress.com", country: "United States", countryCode: "US", industry: "Home", products: 14, score: 65, createdAt: "2007-01-01" },
  { domain: "happsy.com", store_name: "Happsy", email: "support@happsy.com", country: "United States", countryCode: "US", industry: "Home", products: 9, score: 64, createdAt: "2016-01-01" },
  { domain: "avocadogreenmattress.com", store_name: "Avocado Green", email: "support@avocadogreenmattress.com", country: "United States", countryCode: "US", industry: "Home", products: 28, score: 78, createdAt: "2015-01-01" },
  { domain: "brentwoodhome.com", store_name: "Brentwood Home", email: "support@brentwoodhome.com", country: "United States", countryCode: "US", industry: "Home", products: 67, score: 77, createdAt: "1987-01-01" },
  { domain: "nestbedding.com", store_name: "Nest Bedding", email: "support@nestbedding.com", country: "United States", countryCode: "US", industry: "Home", products: 45, score: 66, createdAt: "2011-01-01" },
  { domain: "spindle.com", store_name: "Spindle", email: "support@spindle.com", country: "United States", countryCode: "US", industry: "Home", products: 12, score: 63, createdAt: "2013-01-01" },
  { domain: "sleeponlatex.com", store_name: "Sleep On Latex", email: "support@sleeponlatex.com", country: "United States", countryCode: "US", industry: "Home", products: 18, score: 62, createdAt: "2013-01-01" },
  { domain: "mettamattress.com", store_name: "Metta Mattress", email: "support@mettamattress.com", country: "United States", countryCode: "US", industry: "Home", products: 7, score: 61, createdAt: "2016-01-01" },
  { domain: "puregreen.com", store_name: "Pure Green", email: "support@puregreen.com", country: "United States", countryCode: "US", industry: "Home", products: 22, score: 60, createdAt: "2010-01-01" },
  { domain: "sleepez.com", store_name: "Sleep EZ", email: "support@sleepez.com", country: "United States", countryCode: "US", industry: "Home", products: 34, score: 59, createdAt: "1976-01-01" },
  { domain: "mattressfirm.com", store_name: "Mattress Firm", email: "support@mattressfirm.com", country: "United States", countryCode: "US", industry: "Home", products: 890, score: 82, createdAt: "1986-01-01" },
  { domain: "wayfair.com", store_name: "Wayfair", email: "support@wayfair.com", country: "United States", countryCode: "US", industry: "Home", products: 12000, score: 91, createdAt: "2002-08-01" },
  { domain: "overstock.com", store_name: "Overstock", email: "support@overstock.com", country: "United States", countryCode: "US", industry: "Home", products: 5600, score: 88, createdAt: "1999-05-01" },
  { domain: "worldmarket.com", store_name: "World Market", email: "support@worldmarket.com", country: "United States", countryCode: "US", industry: "Home", products: 3400, score: 85, createdAt: "1958-01-01" },
  { domain: "anthropologie.com", store_name: "Anthropologie", email: "support@anthropologie.com", country: "United States", countryCode: "US", industry: "Fashion", products: 2300, score: 87, createdAt: "1992-01-01" },
  { domain: "urbanoutfitters.com", store_name: "Urban Outfitters", email: "support@urbanoutfitters.com", country: "United States", countryCode: "US", industry: "Fashion", products: 1800, score: 86, createdAt: "1970-01-01" },
  { domain: "freepeople.com", store_name: "Free People", email: "support@freepeople.com", country: "United States", countryCode: "US", industry: "Fashion", products: 1200, score: 84, createdAt: "1984-01-01" },
  { domain: "revolve.com", store_name: "Revolve", email: "support@revolve.com", country: "United States", countryCode: "US", industry: "Fashion", products: 4500, score: 89, createdAt: "2003-01-01" },
  { domain: "nordstrom.com", store_name: "Nordstrom", email: "support@nordstrom.com", country: "United States", countryCode: "US", industry: "Fashion", products: 8900, score: 92, createdAt: "1901-01-01" },
  { domain: "shopbop.com", store_name: "Shopbop", email: "support@shopbop.com", country: "United States", countryCode: "US", industry: "Fashion", products: 3400, score: 83, createdAt: "2000-01-01" },
  { domain: "net-a-porter.com", store_name: "Net-a-Porter", email: "support@net-a-porter.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 5600, score: 90, createdAt: "2000-06-01" },
  { domain: "matchesfashion.com", store_name: "Matches Fashion", email: "support@matchesfashion.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 2300, score: 85, createdAt: "1987-01-01" },
  { domain: "farfetch.com", store_name: "Farfetch", email: "support@farfetch.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 6700, score: 91, createdAt: "2007-01-01" },
  { domain: "asos.com", store_name: "ASOS", email: "support@asos.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 12000, score: 93, createdAt: "2000-06-01" },
  { domain: "boohoo.com", store_name: "Boohoo", email: "support@boohoo.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 8900, score: 81, createdAt: "2006-01-01" },
  { domain: "prettylittlething.com", store_name: "PrettyLittleThing", email: "support@prettylittlething.com", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 6700, score: 80, createdAt: "2012-01-01" },
  { domain: "missguided.co.uk", store_name: "Missguided", email: "support@missguided.co.uk", country: "United Kingdom", countryCode: "GB", industry: "Fashion", products: 4500, score: 78, createdAt: "2009-01-01" },
  { domain: "nastygal.com", store_name: "Nasty Gal", email: "support@nastygal.com", country: "United States", countryCode: "US", industry: "Fashion", products: 3400, score: 77, createdAt: "2006-01-01" },
  { domain: "lulus.com", store_name: "Lulus", email: "support@lulus.com", country: "United States", countryCode: "US", industry: "Fashion", products: 2300, score: 79, createdAt: "1996-01-01" },
  { domain: "tobi.com", store_name: "Tobi", email: "support@tobi.com", country: "United States", countryCode: "US", industry: "Fashion", products: 1200, score: 71, createdAt: "2007-01-01" },
  { domain: "showpo.com", store_name: "Showpo", email: "support@showpo.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 890, score: 74, createdAt: "2010-01-01" },
  { domain: "princesspolly.com", store_name: "Princess Polly", email: "support@princesspolly.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 1200, score: 76, createdAt: "2010-01-01" },
  { domain: "whitefoxboutique.com", store_name: "White Fox", email: "support@whitefoxboutique.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 560, score: 75, createdAt: "2013-01-01" },
  { domain: "beginningboutique.com", store_name: "Beginning Boutique", email: "support@beginningboutique.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 670, score: 73, createdAt: "2008-01-01" },
  { domain: "supre.com.au", store_name: "Supré", email: "support@supre.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 450, score: 70, createdAt: "1984-01-01" },
  { domain: "cottonon.com", store_name: "Cotton On", email: "support@cottonon.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 3400, score: 82, createdAt: "1991-01-01" },
  { domain: "factorie.com.au", store_name: "Factorie", email: "support@factorie.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 890, score: 69, createdAt: "2007-01-01" },
  { domain: "jayjays.com.au", store_name: "Jay Jays", email: "support@jayjays.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 560, score: 68, createdAt: "1993-01-01" },
  { domain: "dotti.com.au", store_name: "Dotti", email: "support@dotti.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 340, score: 67, createdAt: "1981-01-01" },
  { domain: "portmans.com.au", store_name: "Portmans", email: "support@portmans.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 230, score: 66, createdAt: "1946-01-01" },
  { domain: "autographfashion.com.au", store_name: "Autograph", email: "support@autographfashion.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 180, score: 65, createdAt: "1987-01-01" },
  { domain: "crossroads.com.au", store_name: "Crossroads", email: "support@crossroads.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 120, score: 64, createdAt: "1982-01-01" },
  { domain: "millers.com.au", store_name: "Millers", email: "support@millers.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 340, score: 63, createdAt: "1993-01-01" },
  { domain: "rivers.com.au", store_name: "Rivers", email: "support@rivers.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 230, score: 62, createdAt: "1979-01-01" },
  { domain: "rockmans.com.au", store_name: "Rockmans", email: "support@rockmans.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 180, score: 61, createdAt: "1931-01-01" },
  { domain: "beme.com.au", store_name: "Beme", email: "support@beme.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 89, score: 60, createdAt: "2014-01-01" },
  { domain: "katies.com.au", store_name: "Katies", email: "support@katies.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 120, score: 59, createdAt: "1959-01-01" },
  { domain: "nonib.com.au", store_name: "Noni B", email: "support@nonib.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 67, score: 58, createdAt: "1977-01-01" },
  { domain: "w-lane.com.au", store_name: "W.Lane", email: "support@w-lane.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 45, score: 57, createdAt: "1993-01-01" },
  { domain: "harrisscarfe.com.au", store_name: "Harris Scarfe", email: "support@harrisscarfe.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 1200, score: 72, createdAt: "1849-01-01" },
  { domain: "bestandless.com.au", store_name: "Best & Less", email: "support@bestandless.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 890, score: 71, createdAt: "1965-01-01" },
  { domain: "bigw.com.au", store_name: "Big W", email: "support@bigw.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 5600, score: 84, createdAt: "1964-01-01" },
  { domain: "kmart.com.au", store_name: "Kmart Australia", email: "support@kmart.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 8900, score: 86, createdAt: "1969-01-01" },
  { domain: "target.com.au", store_name: "Target Australia", email: "support@target.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 6700, score: 85, createdAt: "1926-01-01" },
  { domain: "myer.com.au", store_name: "Myer", email: "support@myer.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 4500, score: 83, createdAt: "1900-01-01" },
  { domain: "davidjones.com", store_name: "David Jones", email: "support@davidjones.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 3400, score: 82, createdAt: "1838-01-01" },
  { domain: "theiconic.com.au", store_name: "The Iconic", email: "support@theiconic.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 2300, score: 87, createdAt: "2011-10-01" },
  { domain: "surfstitch.com", store_name: "SurfStitch", email: "support@surfstitch.com", country: "Australia", countryCode: "AU", industry: "Fashion", products: 1200, score: 76, createdAt: "2008-01-01" },
  { domain: "surfection.com.au", store_name: "Surfection", email: "support@surfection.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 560, score: 65, createdAt: "1985-01-01" },
  { domain: "citybeach.com.au", store_name: "City Beach", email: "support@citybeach.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 890, score: 74, createdAt: "1985-01-01" },
  { domain: "glueStore.com.au", store_name: "Glue Store", email: "support@glueStore.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 340, score: 73, createdAt: "1998-01-01" },
  { domain: "generalpants.com.au", store_name: "General Pants", email: "support@generalpants.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 560, score: 75, createdAt: "1972-01-01" },
  { domain: "hallenstein.com", store_name: "Hallenstein Brothers", email: "support@hallenstein.com", country: "New Zealand", countryCode: "NZ", industry: "Fashion", products: 230, score: 68, createdAt: "1903-01-01" },
  { domain: "tarocash.com.au", store_name: "Tarocash", email: "support@tarocash.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 180, score: 67, createdAt: "1987-01-01" },
  { domain: "yd.com.au", store_name: "yd.", email: "support@yd.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 120, score: 66, createdAt: "1998-01-01" },
  { domain: "connor.com.au", store_name: "Connor", email: "support@connor.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 340, score: 69, createdAt: "2007-01-01" },
  { domain: "johnnybigg.com.au", store_name: "Johnny Bigg", email: "support@johnnybigg.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 230, score: 70, createdAt: "2010-01-01" },
  { domain: "aquila.com.au", store_name: "Aquila", email: "support@aquila.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 89, score: 64, createdAt: "1958-01-01" },
  { domain: "florsheim.com.au", store_name: "Florsheim", email: "support@florsheim.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 120, score: 63, createdAt: "1892-01-01" },
  { domain: "hushpuppies.com.au", store_name: "Hush Puppies", email: "support@hushpuppies.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 67, score: 62, createdAt: "1958-01-01" },
  { domain: "colorado.com.au", store_name: "Colorado", email: "support@colorado.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 180, score: 61, createdAt: "1992-01-01" },
  { domain: "betts.com.au", store_name: "Betts", email: "support@betts.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 230, score: 60, createdAt: "1892-01-01" },
  { domain: "williams.com.au", store_name: "Williams", email: "support@williams.com.au", country: "Australia", countryCode: "AU", industry: "Fashion", products: 89, score: 59, createdAt: "1865-01-01" },
  { domain: "sportsmart.com.au", store_name: "Sportsmart", email: "support@sportsmart.com.au", country: "Australia", countryCode: "AU", industry: "Fitness", products: 1200, score: 71, createdAt: "1983-01-01" },
  { domain: "rebel.com.au", store_name: "Rebel Sport", email: "support@rebel.com.au", country: "Australia", countryCode: "AU", industry: "Fitness", products: 3400, score: 83, createdAt: "1985-01-01" },
  { domain: "amartfurniture.com.au", store_name: "Amart Furniture", email: "support@amartfurniture.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 2300, score: 78, createdAt: "1970-01-01" },
  { domain: "fantasticfurniture.com.au", store_name: "Fantastic Furniture", email: "support@fantasticfurniture.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 1200, score: 76, createdAt: "1989-01-01" },
  { domain: "ozdesignfurniture.com.au", store_name: "OZ Design", email: "support@ozdesignfurniture.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 560, score: 72, createdAt: "1977-01-01" },
  { domain: "freedom.com.au", store_name: "Freedom", email: "support@freedom.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 1800, score: 80, createdAt: "1981-01-01" },
  { domain: "snooze.com.au", store_name: "Snooze", email: "support@snooze.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 340, score: 74, createdAt: "1974-01-01" },
  { domain: "fortywinks.com.au", store_name: "Forty Winks", email: "support@fortywinks.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 560, score: 75, createdAt: "1984-01-01" },
  { domain: "bedsbarn.com.au", store_name: "Beds R Us", email: "support@bedsbarn.com.au", country: "Australia", countryCode: "AU", industry: "Home", products: 230, score: 69, createdAt: "1987-01-01" },
  { domain: "beckerfurnitureworld.com", store_name: "Becker Furniture", email: "support@beckerfurnitureworld.com", country: "United States", countryCode: "US", industry: "Home", products: 890, score: 70, createdAt: "1978-01-01" },
  { domain: "mathisbrothers.com", store_name: "Mathis Brothers", email: "support@mathisbrothers.com", country: "United States", countryCode: "US", industry: "Home", products: 1200, score: 71, createdAt: "1960-01-01" },
  { domain: "havertys.com", store_name: "Havertys", email: "support@havertys.com", country: "United States", countryCode: "US", industry: "Home", products: 1800, score: 73, createdAt: "1885-01-01" },
  { domain: "raymourflanigan.com", store_name: "Raymour & Flanigan", email: "support@raymourflanigan.com", country: "United States", countryCode: "US", industry: "Home", products: 2300, score: 74, createdAt: "1947-01-01" },
  { domain: "ashleyfurniture.com", store_name: "Ashley Furniture", email: "support@ashleyfurniture.com", country: "United States", countryCode: "US", industry: "Home", products: 5600, score: 86, createdAt: "1945-01-01" },
  { domain: "rooms2go.com", store_name: "Rooms To Go", email: "support@rooms2go.com", country: "United States", countryCode: "US", industry: "Home", products: 3400, score: 79, createdAt: "1990-09-07" },
  { domain: "livingspaces.com", store_name: "Living Spaces", email: "support@livingspaces.com", country: "United States", countryCode: "US", industry: "Home", products: 2300, score: 77, createdAt: "2003-01-01" },
  { domain: "rcwilley.com", store_name: "RC Willey", email: "support@rcwilley.com", country: "United States", countryCode: "US", industry: "Home", products: 1200, score: 72, createdAt: "1932-01-01" },
  { domain: "gardner-white.com", store_name: "Gardner-White", email: "support@gardner-white.com", country: "United States", countryCode: "US", industry: "Home", products: 890, score: 70, createdAt: "1912-01-01" },
  { domain: "slumberland.com", store_name: "Slumberland", email: "support@slumberland.com", country: "United States", countryCode: "US", industry: "Home", products: 670, score: 69, createdAt: "1967-01-01" },
  { domain: "homfurniture.com", store_name: "HOM Furniture", email: "support@homfurniture.com", country: "United States", countryCode: "US", industry: "Home", products: 1200, score: 68, createdAt: "1973-01-01" },
  { domain: "daniafurniture.com", store_name: "Dania Furniture", email: "support@daniafurniture.com", country: "United States", countryCode: "US", industry: "Home", products: 560, score: 67, createdAt: "1962-01-01" },
  { domain: "scandinaviandesigns.com", store_name: "Scandinavian Designs", email: "support@scandinaviandesigns.com", country: "United States", countryCode: "US", industry: "Home", products: 890, score: 71, createdAt: "1963-01-01" },
  { domain: "roomandboard.com", store_name: "Room & Board", email: "support@roomandboard.com", country: "United States", countryCode: "US", industry: "Home", products: 1200, score: 82, createdAt: "1980-01-01" },
  { domain: "designwithinreach.com", store_name: "Design Within Reach", email: "support@designwithinreach.com", country: "United States", countryCode: "US", industry: "Home", products: 2300, score: 84, createdAt: "1998-01-01" },
  { domain: "cb2.com", store_name: "CB2", email: "support@cb2.com", country: "United States", countryCode: "US", industry: "Home", products: 3400, score: 83, createdAt: "2000-01-01" },
  { domain: "westelm.com", store_name: "West Elm", email: "support@westelm.com", country: "United States", countryCode: "US", industry: "Home", products: 4500, score: 85, createdAt: "2002-01-01" },
  { domain: "potterybarn.com", store_name: "Pottery Barn", email: "support@potterybarn.com", country: "United States", countryCode: "US", industry: "Home", products: 6700, score: 87, createdAt: "1949-01-01" },
  { domain: "crateandbarrel.com", store_name: "Crate & Barrel", email: "support@crateandbarrel.com", country: "United States", countryCode: "US", industry: "Home", products: 5600, score: 88, createdAt: "1962-01-01" },
  { domain: "williams-sonoma.com", store_name: "Williams Sonoma", email: "support@williams-sonoma.com", country: "United States", countryCode: "US", industry: "Home", products: 8900, score: 89, createdAt: "1956-01-01" },
  { domain: "surlatable.com", store_name: "Sur La Table", email: "support@surlatable.com", country: "United States", countryCode: "US", industry: "Home", products: 3400, score: 81, createdAt: "1972-01-01" },
  { domain: "bedbathandbeyond.com", store_name: "Bed Bath & Beyond", email: "support@bedbathandbeyond.com", country: "United States", countryCode: "US", industry: "Home", products: 12000, score: 90, createdAt: "1971-01-01" },
];

export function searchStores(
  country?: string,
  industry?: string,
  minProducts?: number,
  maxProducts?: number,
  createdYear?: number,
  createdMonth?: number,
  createdDay?: number,
  limit: number = 20
): StoreRecord[] {
  let results = [...SHOPIFY_STORES];

  if (country) {
    results = results.filter((s) => s.countryCode === country || s.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (industry) {
    results = results.filter((s) => s.industry.toLowerCase() === industry.toLowerCase());
  }

  if (minProducts !== undefined) {
    results = results.filter((s) => s.products >= minProducts);
  }

  if (maxProducts !== undefined) {
    results = results.filter((s) => s.products <= maxProducts);
  }

  if (createdYear) {
    results = results.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getFullYear() === createdYear;
    });
  }

  if (createdMonth) {
    results = results.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() + 1 === createdMonth;
    });
  }

  if (createdDay) {
    results = results.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getDate() === createdDay;
    });
  }

  return results.slice(0, limit);
}