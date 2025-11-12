// Ontario high schools data
export interface School {
  id: string;
  name: string;
  city: string;
  slug: string;
  alternateSlugs?: string[];
}

export const ontarioSchools: School[] = [
  // GTA - Toronto
  { id: "1", name: "Alexander Mackenzie High School", city: "Richmond Hill", slug: "alexander-mackenzie-high-school" },
  { id: "2", name: "Anderson Collegiate Vocational Institute", city: "Whitby", slug: "anderson-collegiate-vocational-institute" },
  { id: "3", name: "Aurora High School", city: "Aurora", slug: "aurora-high-school" },
  { id: "4", name: "Bayview Secondary School", city: "Richmond Hill", slug: "bayview-secondary-school" },
  { id: "5", name: "Bill Crothers Secondary School", city: "Markham", slug: "bill-crothers-secondary-school" },
  { id: "6", name: "Dr. G.W. Williams Secondary School", city: "Aurora", slug: "dr-gw-williams-secondary-school" },
  { id: "7", name: "Dunbarton High School", city: "Pickering", slug: "dunbarton-high-school" },
  { id: "8", name: "Earl Haig Secondary School", city: "Toronto", slug: "earl-haig-secondary-school" },
  { id: "9", name: "Henry Street High School", city: "Whitby", slug: "henry-street-high-school" },
  { id: "10", name: "Huron Heights Secondary School", city: "Newmarket", slug: "huron-heights-secondary-school" },
  { id: "11", name: "Ajax High School", city: "Ajax", slug: "ajax-high-school" },
  { id: "12", name: "Markham District High School", city: "Markham", slug: "markham-district-high-school" },
  { id: "13", name: "Newmarket High School", city: "Newmarket", slug: "newmarket-high-school" },
  { id: "14", name: "Northern Secondary School", city: "Toronto", slug: "northern-secondary-school" },
  { id: "15", name: "Pickering College", city: "Newmarket", slug: "pickering-college" },
  { id: "16", name: "Pickering High School", city: "Ajax", slug: "pickering-high-school", alternateSlugs: ["phs"] },
  { id: "17", name: "Richmond Hill High School", city: "Richmond Hill", slug: "richmond-hill-high-school" },
  { id: "18", name: "Sinclair Secondary School", city: "Whitby", slug: "sinclair-secondary-school" },
  { id: "19", name: "Sir William Mulock Secondary School", city: "Newmarket", slug: "sir-william-mulock-secondary-school" },
  { id: "20", name: "Stephen Lewis Secondary School", city: "Vaughan", slug: "stephen-lewis-secondary-school" },
  { id: "21", name: "Thornhill Secondary School", city: "Thornhill", slug: "thornhill-secondary-school" },
  { id: "22", name: "Unionville High School", city: "Markham", slug: "unionville-high-school" },
  { id: "23", name: "Vaughan Secondary School", city: "Vaughan", slug: "vaughan-secondary-school" },
  { id: "24", name: "Don Mills Collegiate Institute", city: "Toronto", slug: "don-mills-collegiate-institute" },
  { id: "25", name: "Westmount Collegiate Institute", city: "Toronto", slug: "westmount-collegiate-institute" },
  { id: "26", name: "William Lyon Mackenzie Collegiate Institute", city: "Toronto", slug: "william-lyon-mackenzie-collegiate-institute" },
  { id: "27", name: "York Mills Collegiate Institute", city: "Toronto", slug: "york-mills-collegiate-institute" },
  { id: "28", name: "Richmond Green Secondary School", city: "Richmond Hill", slug: "richmond-green-secondary-school" },
  { id: "29", name: "Bill Hogarth Secondary School", city: "Markham", slug: "bill-hogarth-secondary-school" },
  { id: "30", name: "Pierre Elliott Trudeau High School", city: "Markham", slug: "pierre-elliott-trudeau-high-school" },
  { id: "31", name: "St. Robert Catholic High School", city: "Thornhill", slug: "st-robert-catholic-high-school" },
  { id: "32", name: "St. Theresa of Lisieux Catholic High School", city: "Markham", slug: "st-theresa-of-lisieux-catholic-high-school" },
  { id: "33", name: "Father Bressani Catholic High School", city: "Woodbridge", slug: "father-bressani-catholic-high-school" },
  { id: "34", name: "Cardinal Carter Catholic High School", city: "Aurora", slug: "cardinal-carter-catholic-high-school" },
  { id: "35", name: "St. Elizabeth Catholic High School", city: "Thornhill", slug: "st-elizabeth-catholic-high-school" },
  { id: "36", name: "Agincourt Collegiate Institute", city: "Toronto", slug: "agincourt-collegiate-institute" },
  { id: "37", name: "Bloor Collegiate Institute", city: "Toronto", slug: "bloor-collegiate-institute" },
  { id: "38", name: "Brampton Central Secondary School", city: "Brampton", slug: "brampton-central-secondary-school" },
  { id: "39", name: "Cardinal Leger Secondary School", city: "Toronto", slug: "cardinal-leger-secondary-school" },
  { id: "40", name: "Cedarbrae Collegiate Institute", city: "Toronto", slug: "cedarbrae-collegiate-institute" },
  { id: "41", name: "Central Technical School", city: "Toronto", slug: "central-technical-school" },
  { id: "42", name: "Chinguacousy Secondary School", city: "Brampton", slug: "chinguacousy-secondary-school" },
  { id: "43", name: "Danforth Collegiate and Technical Institute", city: "Toronto", slug: "danforth-collegiate-and-technical-institute" },
  { id: "44", name: "David and Mary Thomson Collegiate Institute", city: "Toronto", slug: "david-and-mary-thomson-collegiate-institute" },
  { id: "45", name: "Downsview Secondary School", city: "Toronto", slug: "downsview-secondary-school" },
  { id: "46", name: "Emery Collegiate Institute", city: "Toronto", slug: "emery-collegiate-institute" },
  { id: "47", name: "Etobicoke Collegiate Institute", city: "Toronto", slug: "etobicoke-collegiate-institute" },
  { id: "48", name: "Etobicoke School of the Arts", city: "Toronto", slug: "etobicoke-school-of-the-arts" },
  { id: "49", name: "Georges Vanier Secondary School", city: "Brampton", slug: "georges-vanier-secondary-school" },
  { id: "50", name: "Greenfield Secondary School", city: "Brampton", slug: "greenfield-secondary-school" },
  { id: "51", name: "Harbord Collegiate Institute", city: "Toronto", slug: "harbord-collegiate-institute" },
  { id: "52", name: "Humberview Secondary School", city: "Toronto", slug: "humberview-secondary-school" },
  { id: "53", name: "Jarvis Collegiate Institute", city: "Toronto", slug: "jarvis-collegiate-institute" },
  { id: "54", name: "John Paul II Catholic Secondary School", city: "Brampton", slug: "john-paul-ii-catholic-secondary-school" },
  { id: "55", name: "Kipling High School", city: "Toronto", slug: "kipling-high-school" },
  { id: "56", name: "Lakeshore Collegiate Institute", city: "Toronto", slug: "lakeshore-collegiate-institute" },
  { id: "57", name: "Lawrence Park Collegiate Institute", city: "Toronto", slug: "lawrence-park-collegiate-institute" },
  { id: "58", name: "Loretto Abbey Catholic Secondary School", city: "Toronto", slug: "loretto-abbey-catholic-secondary-school" },
  { id: "59", name: "Monarch Park Collegiate Institute", city: "Toronto", slug: "monarch-park-collegiate-institute" },
  { id: "60", name: "Neil McNeil Catholic High School", city: "Toronto", slug: "neil-mcneil-catholic-high-school" },
  { id: "61", name: "Oakwood Collegiate Institute", city: "Toronto", slug: "oakwood-collegiate-institute" },
  { id: "62", name: "Parkdale Collegiate Institute", city: "Toronto", slug: "parkdale-collegiate-institute" },
  { id: "63", name: "Pine Ridge Secondary School", city: "Pickering", slug: "pine-ridge-secondary-school" },
  { id: "64", name: "Rankin Secondary School", city: "Whitby", slug: "rankin-secondary-school" },
  { id: "65", name: "Richview Collegiate Institute", city: "Toronto", slug: "richview-collegiate-institute" },
  { id: "66", name: "Riverdale Collegiate Institute", city: "Toronto", slug: "riverdale-collegiate-institute" },
  { id: "67", name: "Runnymede Collegiate Institute", city: "Toronto", slug: "runnymede-collegiate-institute" },
  { id: "68", name: "Scarborough Bluffs Collegiate Institute", city: "Toronto", slug: "scarborough-bluffs-collegiate-institute" },
  { id: "69", name: "Scarborough Centre for Alternative Programs", city: "Toronto", slug: "scarborough-centre-for-alternative-programs" },
  { id: "70", name: "Scarborough Village School", city: "Toronto", slug: "scarborough-village-school" },
  { id: "71", name: "Sentinel Secondary School", city: "Toronto", slug: "sentinel-secondary-school" },
  { id: "72", name: "Silverthorn Collegiate Institute", city: "Toronto", slug: "silverthorn-collegiate-institute" },
  { id: "73", name: "South Collegiate Institute", city: "Toronto", slug: "south-collegiate-institute" },
  { id: "74", name: "St. Andrew's College", city: "Aurora", slug: "st-andrews-college" },
  { id: "75", name: "Streetcar Crowchild Secondary School", city: "Toronto", slug: "streetcar-crowchild-secondary-school" },
  { id: "76", name: "Thistletown Collegiate Institute", city: "Toronto", slug: "thistletown-collegiate-institute" },
  { id: "77", name: "Turner Fenton Secondary School", city: "Brampton", slug: "turner-fenton-secondary-school" },
  { id: "78", name: "Weston Collegiate Institute", city: "Toronto", slug: "weston-collegiate-institute" },
  { id: "79", name: "West Humber Collegiate Institute", city: "Toronto", slug: "west-humber-collegiate-institute" },
  { id: "80", name: "Woburn Collegiate Institute", city: "Toronto", slug: "woburn-collegiate-institute" },
  { id: "81", name: "Woodbridge High School", city: "Woodbridge", slug: "woodbridge-high-school" },
  { id: "82", name: "Bell High School", city: "Brampton", slug: "bell-high-school" },
  { id: "83", name: "Erin Mills Secondary School", city: "Mississauga", slug: "erin-mills-secondary-school" },
  { id: "84", name: "Erindale Secondary School", city: "Mississauga", slug: "erindale-secondary-school" },
  { id: "85", name: "Glenforest Secondary School", city: "Mississauga", slug: "glenforest-secondary-school" },
  { id: "86", name: "Glenview Secondary School", city: "Toronto", slug: "glenview-secondary-school" },
  { id: "87", name: "Lorne Park Secondary School", city: "Mississauga", slug: "lorne-park-secondary-school" },
  { id: "88", name: "Meadowvale Secondary School", city: "Mississauga", slug: "meadowvale-secondary-school" },
  { id: "89", name: "North Albion Collegiate Institute", city: "Toronto", slug: "north-albion-collegiate-institute" },
  { id: "90", name: "Oakville Trafalgar High School", city: "Oakville", slug: "oakville-trafalgar-high-school" },
  { id: "91", name: "Father David Bauer Academy", city: "Toronto", slug: "father-david-bauer-academy" },
  
  // Hamilton Area
  { id: "92", name: "Sir Allan MacNab Secondary School", city: "Hamilton", slug: "sir-allan-macnab-secondary-school" },
  { id: "93", name: "Westdale Secondary School", city: "Hamilton", slug: "westdale-secondary-school" },
  { id: "94", name: "Cathedral High School", city: "Hamilton", slug: "cathedral-high-school" },
  { id: "95", name: "McMaster University Secondary", city: "Hamilton", slug: "mcmaster-university-secondary" },
  { id: "96", name: "Glanbrook High School", city: "Glanbrook", slug: "glanbrook-high-school" },
  { id: "97", name: "Spencer High School", city: "Spencer", slug: "spencer-high-school" },
  { id: "98", name: "Dundas Secondary School", city: "Dundas", slug: "dundas-secondary-school" },
  
  // Niagara Region
  { id: "99", name: "Blessed Trinity Catholic Secondary School", city: "St. Catharines", slug: "blessed-trinity-catholic-secondary-school" },
  { id: "100", name: "Collegiate Institute", city: "St. Catharines", slug: "collegiate-institute" },
  { id: "101", name: "Governor Simcoe Secondary School", city: "St. Catharines", slug: "governor-simcoe-secondary-school" },
  { id: "102", name: "Lakeport Secondary School", city: "St. Catharines", slug: "lakeport-secondary-school" },
  { id: "103", name: "St. Christopher Secondary School", city: "Niagara Falls", slug: "st-christopher-secondary-school" },
  { id: "104", name: "A.N. Myer Secondary School", city: "Niagara Falls", slug: "a-n-myer-secondary-school" },
  { id: "105", name: "Stamford Collegiate School", city: "Niagara Falls", slug: "stamford-collegiate-school" },
  { id: "106", name: "Welland Secondary School", city: "Welland", slug: "welland-secondary-school" },
  { id: "107", name: "Port Colborne High School", city: "Port Colborne", slug: "port-colborne-high-school" },
  
  // Waterloo Region
  { id: "108", name: "Kitchener-Waterloo Collegiate and Vocational School", city: "Kitchener", slug: "kitchener-waterloo-collegiate-and-vocational-school" },
  { id: "109", name: "St. Jerome's High School", city: "Kitchener", slug: "st-jeromes-high-school" },
  { id: "110", name: "Resurrection Catholic Secondary School", city: "Kitchener", slug: "resurrection-catholic-secondary-school" },
  { id: "111", name: "Waterloo Collegiate Institute", city: "Waterloo", slug: "waterloo-collegiate-institute" },
  { id: "112", name: "Bluevale Collegiate Institute", city: "Waterloo", slug: "bluevale-collegiate-institute" },
  { id: "113", name: "Eastwood Collegiate Institute", city: "Kitchener", slug: "eastwood-collegiate-institute" },
  { id: "114", name: "Galt Collegiate Institute and Vocational School", city: "Cambridge", slug: "galt-collegiate-institute-and-vocational-school" },
  { id: "115", name: "Cambridge Secondary School", city: "Cambridge", slug: "cambridge-secondary-school" },
  { id: "116", name: "John F. Ross Collegiate Vocational Institute", city: "Guelph", slug: "john-f-ross-collegiate-vocational-institute" },
  
  // Wellington County
  { id: "117", name: "Guelph Collegiate Vocational Institute", city: "Guelph", slug: "guelph-collegiate-vocational-institute" },
  { id: "118", name: "Saint James Catholic High School", city: "Guelph", slug: "saint-james-catholic-high-school" },
  { id: "119", name: "Douglas Secondary School", city: "Guelph", slug: "douglas-secondary-school" },
  { id: "120", name: "Fergus High School", city: "Fergus", slug: "fergus-high-school" },
  
  // Brantford Area
  { id: "121", name: "Brantford Collegiate Institute", city: "Brantford", slug: "brantford-collegiate-institute" },
  { id: "122", name: "St. Ninians and Assumption Catholic Secondary School", city: "Brantford", slug: "st-ninians-and-assumption-catholic-secondary-school" },
  { id: "123", name: "Paris High School", city: "Paris", slug: "paris-high-school" },
  
  // Simcoe County
  { id: "124", name: "Barrie Central Collegiate Institute", city: "Barrie", slug: "barrie-central-collegiate-institute" },
  { id: "125", name: "Eastview Secondary School", city: "Barrie", slug: "eastview-secondary-school" },
  { id: "126", name: "Georgian Shores Secondary School", city: "Collingwood", slug: "georgian-shores-secondary-school" },
  { id: "127", name: "Bradford District High School", city: "Bradford", slug: "bradford-district-high-school" },
  { id: "128", name: "Alliston High School", city: "Alliston", slug: "alliston-high-school" },
  { id: "129", name: "Ivy Lea High School", city: "Ivy", slug: "ivy-lea-high-school" },
  
  // Durham Region
  { id: "130", name: "Bowmanville Secondary School", city: "Bowmanville", slug: "bowmanville-secondary-school" },
  { id: "131", name: "Clarington Secondary School", city: "Bowmanville", slug: "clarington-secondary-school" },
  { id: "132", name: "Lake Ridge Secondary School", city: "Whitby", slug: "lake-ridge-secondary-school" },
  { id: "133", name: "Oshawa High School", city: "Oshawa", slug: "oshawa-high-school" },
  { id: "134", name: "Oshawa Collegiate Institute", city: "Oshawa", slug: "oshawa-collegiate-institute" },
  
  // Oxford and Brant
  { id: "135", name: "Woodstock Collegiate Institute", city: "Woodstock", slug: "woodstock-collegiate-institute" },
  { id: "136", name: "Norwich High School", city: "Norwich", slug: "norwich-high-school" },
  { id: "137", name: "Tillsonburg High School", city: "Tillsonburg", slug: "tillsonburg-high-school" },
  
  // Halton Region
  { id: "138", name: "Acton High School", city: "Acton", slug: "acton-high-school" },
  { id: "139", name: "Assumption Secondary School", city: "Burlington", slug: "assumption-secondary-school" },
  { id: "140", name: "Appleby College", city: "Burlington", slug: "appleby-college" },
  { id: "141", name: "Nelson High School", city: "Burlington", slug: "nelson-high-school" },
  { id: "142", name: "Milton District High School", city: "Milton", slug: "milton-district-high-school" },
  { id: "143", name: "Sheridan Secondary School", city: "Oakville", slug: "sheridan-secondary-school" },
  { id: "144", name: "White Oaks Secondary School", city: "Oakville", slug: "white-oaks-secondary-school" },
  { id: "145", name: "John Mighton Secondary School", city: "Oakville", slug: "john-mighton-secondary-school" },
  { id: "146", name: "Applewood Heights Secondary School", city: "Mississauga", slug: "applewood-heights-secondary-school" },
  { id: "147", name: "Port Credit Secondary School", city: "Mississauga", slug: "port-credit-secondary-school" },
  
  // Peel Region
  { id: "148", name: "Mississauga Secondary School", city: "Mississauga", slug: "mississauga-secondary-school" },
  { id: "149", name: "Meadowvale Secondary School", city: "Mississauga", slug: "meadowvale-secondary-school-2" },
  { id: "150", name: "Cawthra Park Secondary School", city: "Mississauga", slug: "cawthra-park-secondary-school" },
];


// Helper function to search schools
export const searchSchools = (query: string): School[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return ontarioSchools.filter(school =>
    school.name.toLowerCase().includes(lowerQuery) ||
    school.city.toLowerCase().includes(lowerQuery)
  );
};

// Helper function to get school by slug
export const getSchoolBySlug = (slug: string): School | undefined => {
  return ontarioSchools.find(school =>
    school.slug === slug || school.alternateSlugs?.includes(slug)
  );
};

