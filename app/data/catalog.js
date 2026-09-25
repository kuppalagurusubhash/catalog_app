export const OWNER_WHATSAPP_NUMBER = '917732000110';
export const OWNER_PHONE_DISPLAY = '+91 77320 00110';
export const KERALA_DISPATCH_HOTLINE = '+91 77320 00110';

export const CATEGORIES = [
  { id: 'all', name: 'All Varieties', malayalam: 'എല്ലാം', icon: 'grid' },
  { id: 'flooring', name: 'Flooring Slabs', malayalam: 'ഫ്ലോർ സ്ലാബുകൾ', img: '/s2.jpeg' },
  { id: 'pathways', name: 'Steps & Pathways', malayalam: 'നടപ്പാത & പടികൾ', img: '/p3.jpeg' },
  { id: 'cobbles', name: 'Cabuls & Cobbles', malayalam: 'കോബിൾസ് & കട്ടകൾ', img: '/cabuls-44.jpg' },
  { id: 'articles', name: 'Special Articles', malayalam: 'ആർട്ടിക്കിളുകൾ', img: '/articles-spec.jpg' }
];

// Delivery restricted ONLY to these 7 transfer districts
export const KERALA_DISTRICTS = [
  { id: 'Thrissur', name: 'Thrissur (തൃശ്ശൂർ)', note: 'Base Depot Rate' },
  { id: 'Palakkad', name: 'Palakkad (പാലക്കാട്)', note: '₹2 less than Thrissur' },
  { id: 'Malappuram', name: 'Malappuram (മലപ്പുറം)', note: '₹2 less than Thrissur' },
  { id: 'Kozhikode', name: 'Calicut / Kozhikode (കോഴിക്കോട്)', note: '₹2 less than Thrissur' },
  { id: 'Kannur', name: 'Kannur (കണ്ണൂർ)', note: '₹1 less than Thrissur' },
  { id: 'Kasaragod', name: 'Kasaragod (കാസർഗോഡ്)', note: '₹1 less than Thrissur' },
  { id: 'Wayanad', name: 'Wayanad (വയനാട്)', note: '₹1 less than Thrissur' }
];

// Exact selling rates per sqft / per piece across the 7 transfer places
export const DISTRICT_RATES = {
  'Thrissur': {
    'KB-22-50': 52,
    'KB-22-40': 46,
    'KB-22-30': 40,
    'KB-215-50': 48,
    'KB-32-50': 54,
    'KB-32-40': 50,
    'KB-21-50': 46,
    'KB-11-50': 46,
    'KB-CAB-44': 8,
    'KB-42-50': 56,
    'KB-ART-SPEC': 140
  },
  'Palakkad': {
    'KB-22-50': 50,
    'KB-22-40': 44,
    'KB-22-30': 38,
    'KB-215-50': 46,
    'KB-32-50': 52,
    'KB-32-40': 48,
    'KB-21-50': 44,
    'KB-11-50': 44,
    'KB-CAB-44': 8,
    'KB-42-50': 54,
    'KB-ART-SPEC': 140
  },
  'Malappuram': {
    'KB-22-50': 50,
    'KB-22-40': 44,
    'KB-22-30': 38,
    'KB-215-50': 46,
    'KB-32-50': 52,
    'KB-32-40': 48,
    'KB-21-50': 44,
    'KB-11-50': 44,
    'KB-CAB-44': 8,
    'KB-42-50': 54,
    'KB-ART-SPEC': 140
  },
  'Kozhikode': {
    'KB-22-50': 50,
    'KB-22-40': 44,
    'KB-22-30': 38,
    'KB-215-50': 46,
    'KB-32-50': 52,
    'KB-32-40': 48,
    'KB-21-50': 44,
    'KB-11-50': 44,
    'KB-CAB-44': 8,
    'KB-42-50': 54,
    'KB-ART-SPEC': 140
  },
  'Kannur': {
    'KB-22-50': 51,
    'KB-22-40': 45,
    'KB-22-30': 39,
    'KB-215-50': 47,
    'KB-32-50': 53,
    'KB-32-40': 49,
    'KB-21-50': 45,
    'KB-11-50': 45,
    'KB-CAB-44': 8,
    'KB-42-50': 55,
    'KB-ART-SPEC': 140
  },
  'Kasaragod': {
    'KB-22-50': 51,
    'KB-22-40': 45,
    'KB-22-30': 39,
    'KB-215-50': 47,
    'KB-32-50': 53,
    'KB-32-40': 49,
    'KB-21-50': 45,
    'KB-11-50': 45,
    'KB-CAB-44': 8,
    'KB-42-50': 55,
    'KB-ART-SPEC': 140
  },
  'Wayanad': {
    'KB-22-50': 51,
    'KB-22-40': 45,
    'KB-22-30': 39,
    'KB-215-50': 47,
    'KB-32-50': 53,
    'KB-32-40': 49,
    'KB-21-50': 45,
    'KB-11-50': 45,
    'KB-CAB-44': 8,
    'KB-42-50': 55,
    'KB-ART-SPEC': 140
  }
};

export const getStoneRate = (stoneCode, districtId = 'Thrissur') => {
  const ratesForDistrict = DISTRICT_RATES[districtId] || DISTRICT_RATES['Thrissur'];
  return ratesForDistrict[stoneCode] || 52;
};

export const STONE_CATALOG = [
  {
    code: 'KB-22-50',
    name: '2×2 Heavy 50mm Slab',
    malayalamTitle: '(2×2 · 50mm ഹെവി സ്ലാബ്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Natural Rough / Calibrated',
    finishBadge: 'Heavy Duty 50mm',
    badgeVariant: 'teal',
    ratePerSqft: 52, // Thrissur base rate
    isBestValue: false,
    slabArea: 4,
    image: '/p2.jpeg',
    keralaUse: 'Heavy Porch, Car Parking & Entrance Driveway (വണ്ടികയറുന്ന പോർച്ച്)',
    tag: '50mm Heavy Load Bearing',
    weightPerSqftKg: 12.5,
    category: 'flooring'
  },
  {
    code: 'KB-22-40',
    name: '2×2 Calibrated 40mm Slab',
    malayalamTitle: '(2×2 · 40mm സ്റ്റാൻഡേർഡ്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 40mm',
    thickness: '40mm',
    pricingUnit: 'sqft',
    finish: 'Calibrated Smooth',
    finishBadge: 'Medium Calibrated 40mm',
    badgeVariant: 'amber',
    ratePerSqft: 46, // Thrissur base rate
    isBestValue: false,
    slabArea: 4,
    image: '/p1.jpeg',
    keralaUse: 'Sitout, Veranda, Covered Patio & Living Steps (മുറ്റങ്ങളും വരാന്തയും)',
    tag: 'Ideal Residential Balance',
    weightPerSqftKg: 10.0,
    category: 'flooring'
  },
  {
    code: 'KB-22-30',
    name: '2×2 Natural 30mm Slab',
    malayalamTitle: '(2×2 · 30mm ക്ലാസിക് സ്ലാബ്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 30mm',
    thickness: '30mm',
    pricingUnit: 'sqft',
    finish: 'Natural Split',
    finishBadge: 'Natural Split 30mm',
    badgeVariant: 'green',
    ratePerSqft: 40, // Thrissur base rate
    isBestValue: true,
    slabArea: 4,
    image: '/s2.jpeg',
    keralaUse: 'Open Courtyards, Nadumuttam & Balconies (തുറസ്സായ മുറ്റങ്ങൾ)',
    tag: 'Most Popular & Best Value',
    weightPerSqftKg: 7.5,
    category: 'flooring'
  },
  {
    code: 'KB-215-50',
    name: '2×1½ (2×1.5) Standard 50mm',
    malayalamTitle: '(2×1½ · 50mm സ്പെഷ്യൽ)',
    size: '2x1.5',
    sizeDisplay: '2×1½',
    spec: '2x1.5 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Natural Heavy Split',
    finishBadge: 'Heavy Duty 50mm',
    badgeVariant: 'gold',
    ratePerSqft: 48, // Thrissur base rate
    isBestValue: false,
    slabArea: 3,
    image: '/calc-stone-blocks.jpg',
    keralaUse: 'Interlock border, Stair Tread & Paving (പടവുകൾ, നടപ്പാതകൾ)',
    tag: 'Traditional 18" Kerala Width',
    weightPerSqftKg: 12.5,
    category: 'pathways'
  },
  {
    code: 'KB-32-50',
    name: '3×2 Grand Format 50mm',
    malayalamTitle: '(3×2 · 50mm ബിഗ് സ്ലാബ്)',
    size: '3x2',
    sizeDisplay: '3×2',
    spec: '3x2 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Heavy Duty Calibrated',
    finishBadge: 'Extra Large Format',
    badgeVariant: 'teal',
    ratePerSqft: 54, // Thrissur base rate
    isBestValue: false,
    slabArea: 6,
    image: '/s3.jpeg',
    keralaUse: 'Main Gate Ramp, Commercial Loading Entrance & Large Padippura',
    tag: 'Fewer Grout Lines & Max Strength',
    weightPerSqftKg: 12.5,
    category: 'flooring'
  },
  {
    code: 'KB-32-40',
    name: '3×2 Grand Format 40mm',
    malayalamTitle: '(3×2 · 40mm മീഡിയം സ്ലാബ്)',
    size: '3x2',
    sizeDisplay: '3×2',
    spec: '3x2 · 40mm',
    thickness: '40mm',
    pricingUnit: 'sqft',
    finish: 'Smooth Calibrated',
    finishBadge: 'Grand Slab 40mm',
    badgeVariant: 'yellow',
    ratePerSqft: 50, // Thrissur base rate
    isBestValue: false,
    slabArea: 6,
    image: '/p3.jpeg',
    keralaUse: 'Spacious Verandas, Villa Porches & Premium Walkways',
    tag: 'Architect Favorite Big Slabs',
    weightPerSqftKg: 10.0,
    category: 'flooring'
  },
  {
    code: 'KB-21-50',
    name: '2×1 Step & Pathway 50mm',
    malayalamTitle: '(2×1 · 50mm നടപ്പാത)',
    size: '2x1',
    sizeDisplay: '2×1',
    spec: '2x1 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Natural Anti-Slip',
    finishBadge: 'Pathway Special 50mm',
    badgeVariant: 'emerald',
    ratePerSqft: 46, // Thrissur base rate
    isBestValue: false,
    slabArea: 2,
    image: '/s1.jpeg',
    keralaUse: 'Garden Stepping Walkways, Steps & Boundary Borders (തോട്ടപ്പടികൾ)',
    tag: 'High Grip Anti-Slip',
    weightPerSqftKg: 12.5,
    category: 'pathways'
  },
  {
    code: 'KB-11-50',
    name: '1×1 Paving & Border 50mm',
    malayalamTitle: '(1×1 · 50mm സ്ക്വയർ ടൈൽ)',
    size: '1x1',
    sizeDisplay: '1×1',
    spec: '1x1 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Hand Cut Natural',
    finishBadge: 'Square Cobble/Tile',
    badgeVariant: 'amber',
    ratePerSqft: 46, // Thrissur base rate
    isBestValue: false,
    slabArea: 1,
    image: '/hero-stone-tiles.jpg',
    keralaUse: 'Border edging, Small walkways, Tree surrounds & Drain covers',
    tag: 'Compact & Highly Versatile',
    weightPerSqftKg: 12.5,
    category: 'pathways'
  },
  {
    code: 'KB-CAB-44',
    name: 'Cabuls 4×4 Cobblestones',
    malayalamTitle: '(കബുൽസ് 4×4 കോബിൾസ്)',
    size: '4"×4"',
    sizeDisplay: '4"×4"',
    spec: '4x4 inch · 50mm',
    thickness: '50mm',
    pricingUnit: 'piece',
    finish: 'Chiseled Cobble Finish',
    finishBadge: '₹8 Per Piece Flat',
    badgeVariant: 'emerald',
    ratePerSqft: 8, // Per piece flat rate across all districts
    isBestValue: true,
    slabArea: 0.11, // ~0.11 sqft per 4"x4" cobble
    weightPerPieceKg: 1.4,
    image: '/cabuls-44.jpg',
    keralaUse: 'Rustic Garden Pathways, Driveway Paving & Heritage Accents (പാതകൾ)',
    tag: 'Classic 4x4 Heritage Cobbles',
    weightPerSqftKg: 12.5,
    category: 'cobbles'
  },
  {
    code: 'KB-42-50',
    name: '4×2 Giant Block Slab 50mm',
    malayalamTitle: '(4×2 · 50mm ഭീമൻ സ്ലാബ്)',
    size: '4x2',
    sizeDisplay: '4×2',
    spec: '4x2 · 50mm',
    thickness: '50mm',
    pricingUnit: 'sqft',
    finish: 'Quarry Heavy Block',
    finishBadge: 'Giant 4×2 Format',
    badgeVariant: 'gold',
    ratePerSqft: 56, // Thrissur base rate
    isBestValue: false,
    slabArea: 8,
    image: '/quarry-stacks.jpg',
    keralaUse: 'Heavy Lorry Driveways, Bridge Approaches & Prestigious Padippura',
    tag: 'Massive 8 Sq.Ft Single Slab',
    weightPerSqftKg: 12.5,
    category: 'flooring'
  },
  {
    code: 'KB-ART-SPEC',
    name: 'Special Stone Articles',
    malayalamTitle: '(പ്രത്യേക ആർട്ടിക്കിളുകൾ)',
    size: 'Artisan',
    sizeDisplay: 'Artisan',
    spec: 'Custom Craft Piece',
    thickness: 'Standard',
    pricingUnit: 'piece',
    finish: 'Sculpted Artisan Finish',
    finishBadge: '₹140 Per Piece Flat',
    badgeVariant: 'amber',
    ratePerSqft: 140, // Per piece flat rate across all districts
    isBestValue: false,
    slabArea: 1,
    weightPerPieceKg: 15.0,
    image: '/articles-spec.jpg',
    keralaUse: 'Kerala Courtyard Decor, Garden Basins, Pillars & Boundary Ornaments',
    tag: 'Handcrafted Heritage Articles',
    weightPerSqftKg: 15.0,
    category: 'articles'
  }
];
