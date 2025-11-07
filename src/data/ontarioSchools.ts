// Ontario high schools data
export interface School {
  id: string;
  name: string;
  city: string;
  slug: string;
  alternateSlugs?: string[];
}

export const ontarioSchools: School[] = [
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
  { id: "16", name: "Pickering High School", city: "Pickering", slug: "pickering-high-school", alternateSlugs: ["phs"] },
  { id: "17", name: "Richmond Hill High School", city: "Richmond Hill", slug: "richmond-hill-high-school" },
  { id: "18", name: "Sinclair Secondary School", city: "Whitby", slug: "sinclair-secondary-school" },
  { id: "19", name: "Sir William Mulock Secondary School", city: "Newmarket", slug: "sir-william-mulock-secondary-school" },
  { id: "20", name: "Stephen Lewis Secondary School", city: "Vaughan", slug: "stephen-lewis-secondary-school" },
  { id: "21", name: "Thornhill Secondary School", city: "Thornhill", slug: "thornhill-secondary-school" },
  { id: "22", name: "Unionville High School", city: "Markham", slug: "unionville-high-school" },
  { id: "23", name: "Vaughan Secondary School", city: "Vaughan", slug: "vaughan-secondary-school" },
  { id: "24", name: "Don Mills Collegiate Institute", city: "Toronto", slug: "don-mills-collegiate-institute" },
  { id: "25", name: "Ajax High School", city: "Ajax", slug: "ajax-high-school" },
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

