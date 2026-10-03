// ============================================================
// DENIO SPORTS — Categories & Subcategories
// ============================================================

export const categories = [
  {
    id: 'football',
    name: 'Football',
    slug: 'football',
    description: 'Professional footballs, boots, jerseys, and gear for the beautiful game.',
    productCount: 8,
    gradient: 'from-emerald-700 to-emerald-900',
    icon: '⚽',
    subcategories: [
      { id: 'footballs', name: 'Footballs', slug: 'footballs' },
      { id: 'football-boots', name: 'Football Boots', slug: 'football-boots' },
      { id: 'jerseys', name: 'Jerseys', slug: 'jerseys' },
      { id: 'shorts', name: 'Shorts', slug: 'shorts' },
      { id: 'goalkeeper-gear', name: 'Goalkeeper Gear', slug: 'goalkeeper-gear' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'cricket',
    name: 'Cricket',
    slug: 'cricket',
    description: 'Premium cricket bats, balls, gloves, and protective equipment.',
    productCount: 5,
    gradient: 'from-sky-700 to-sky-900',
    icon: '🏏',
    subcategories: [
      { id: 'bats', name: 'Bats', slug: 'bats' },
      { id: 'balls', name: 'Balls', slug: 'balls' },
      { id: 'gloves', name: 'Gloves', slug: 'gloves' },
      { id: 'protective-gear', name: 'Protective Gear', slug: 'protective-gear' },
    ],
  },
  {
    id: 'badminton',
    name: 'Badminton',
    slug: 'badminton',
    description: 'Carbon rackets, shuttlecocks, and court accessories.',
    productCount: 3,
    gradient: 'from-violet-700 to-violet-900',
    icon: '🏸',
    subcategories: [
      { id: 'rackets', name: 'Rackets', slug: 'rackets' },
      { id: 'shuttlecocks', name: 'Shuttlecocks', slug: 'shuttlecocks' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    slug: 'tennis',
    description: 'High-performance tennis rackets, balls, and gear.',
    productCount: 2,
    gradient: 'from-amber-600 to-orange-800',
    icon: '🎾',
    subcategories: [
      { id: 'rackets', name: 'Rackets', slug: 'rackets' },
      { id: 'balls', name: 'Balls', slug: 'balls' },
    ],
  },
  {
    id: 'apparel',
    name: 'Jerseys & Apparel',
    slug: 'apparel',
    description: 'Sportswear, jerseys, shorts, and performance clothing.',
    productCount: 3,
    gradient: 'from-gray-700 to-gray-900',
    icon: '👕',
    subcategories: [
      { id: 'tshirts', name: 'T-Shirts', slug: 'tshirts' },
      { id: 'pants', name: 'Track Pants', slug: 'pants' },
      { id: 'socks', name: 'Socks', slug: 'socks' },
    ],
  },
  {
    id: 'accessories',
    name: 'Sports Accessories',
    slug: 'accessories',
    description: 'Bags, water bottles, cones, and essential training accessories.',
    productCount: 3,
    gradient: 'from-red-700 to-red-900',
    icon: '🎒',
    subcategories: [
      { id: 'bags', name: 'Bags', slug: 'bags' },
      { id: 'training', name: 'Training Equipment', slug: 'training' },
      { id: 'hydration', name: 'Hydration', slug: 'hydration' },
    ],
  },
  {
    id: 'trophies',
    name: 'Trophies & Awards',
    slug: 'trophies',
    description: 'Gold trophies, medals, and awards for tournaments and events.',
    productCount: 2,
    gradient: 'from-yellow-600 to-amber-800',
    icon: '🏆',
    subcategories: [
      { id: 'trophies', name: 'Trophies', slug: 'trophies' },
      { id: 'medals', name: 'Medals', slug: 'medals' },
    ],
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export function getAllSubcategories(categorySlug) {
  const category = getCategoryBySlug(categorySlug);
  return category ? category.subcategories : [];
}
