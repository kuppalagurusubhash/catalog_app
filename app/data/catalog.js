export const OWNER_WHATSAPP_NUMBER = '917732000110';
export const OWNER_PHONE_DISPLAY = '+91 77320 00110';
export const KERALA_DISPATCH_HOTLINE = '+91 77320 00110';

export const CATEGORIES = [
  { id: 'all', name: 'All Stones', malayalam: 'എല്ലാം', icon: 'grid' },
  { id: 'flooring', name: 'Flooring Slabs', malayalam: 'ഫ്ലോർ സ്ലാബുകൾ', img: '/s2.jpeg' },
  { id: 'cladding', name: 'Wall Cladding', malayalam: 'ഭിത്തി പാനലുകൾ', img: '/s1.jpeg' },
  { id: 'pathways', name: 'Steps & Pathways', malayalam: 'പടികളും വഴികളും', img: '/p3.jpeg' },
  { id: 'finish', name: 'Tiles & Finish', malayalam: 'ടൈൽ & ഫിനിഷ്', img: '/p1.jpeg' },
  { id: 'custom', name: 'Custom Orders', malayalam: 'പ്രത്യേക ഓർഡറുകൾ', img: '/s3.jpeg' }
];

export const KERALA_DISTRICTS = [
  { id: 'Palakkad', name: 'Palakkad (പാലക്കാട്)' },
  { id: 'Wayanad', name: 'Wayanad (വയനാട്)' },
  { id: 'Kannur', name: 'Kannur (കണ്ണൂർ)' },
  { id: 'Thrissur', name: 'Thrissur (തൃശ്ശൂർ)' },
  { id: 'Ernakulam', name: 'Ernakulam / Kochi (എറണാകുളം)' },
  { id: 'Malappuram', name: 'Malappuram (മലപ്പുറം)' },
  { id: 'Kozhikode', name: 'Kozhikode (കോഴിക്കോട്)' },
  { id: 'Kottayam', name: 'Kottayam (കോട്ടയം)' },
  { id: 'Alappuzha', name: 'Alappuzha (ആലപ്പുഴ)' },
  { id: 'Kollam', name: 'Kollam (കൊല്ലം)' },
  { id: 'Thiruvananthapuram', name: 'Thiruvananthapuram (തിരുവനന്തപുരം)' },
  { id: 'Kasaragod', name: 'Kasaragod (കാസർഗോഡ്)' },
  { id: 'Pathanamthitta', name: 'Pathanamthitta (പത്തനംതിട്ട)' },
  { id: 'Idukki', name: 'Idukki (ഇടുക്കി)' }
];

// Exact selling rates per sqft by Kerala district (From Admin District Rates)
export const DISTRICT_RATES = {
  'Palakkad': {
    'KB-22-30R': 38,
    'KB-22-40P': 42,
    'KB-22-50P': 40,
    'KB-33-30R': 40,
    'KB-33-40P': 45,
    'KB-33-50R': 42,
  },
  'Wayanad': {
    'KB-22-30R': 42,
    'KB-22-40P': 47,
    'KB-22-50P': 48,
    'KB-33-30R': 45,
    'KB-33-40P': 50,
    'KB-33-50R': 46,
  },
  'Kannur': {
    'KB-22-30R': 44,
    'KB-22-40P': 48,
    'KB-22-50P': 50,
    'KB-33-30R': 47,
    'KB-33-40P': 52,
    'KB-33-50R': 49,
  },
  'Thrissur': {
    'KB-22-30R': 39,
    'KB-22-40P': 43,
    'KB-22-50P': 42,
    'KB-33-30R': 41,
    'KB-33-40P': 46,
    'KB-33-50R': 43,
  },
  'Ernakulam': {
    'KB-22-30R': 41,
    'KB-22-40P': 45,
    'KB-22-50P': 46,
    'KB-33-30R': 43,
    'KB-33-40P': 48,
    'KB-33-50R': 45,
  },
  'Malappuram': {
    'KB-22-30R': 39,
    'KB-22-40P': 43,
    'KB-22-50P': 43,
    'KB-33-30R': 41,
    'KB-33-40P': 46,
    'KB-33-50R': 43,
  },
  'Kozhikode': {
    'KB-22-30R': 43,
    'KB-22-40P': 47,
    'KB-22-50P': 49,
    'KB-33-30R': 46,
    'KB-33-40P': 51,
    'KB-33-50R': 47,
  },
  'Kasaragod': {
    'KB-22-30R': 45,
    'KB-22-40P': 49,
    'KB-22-50P': 51,
    'KB-33-30R': 48,
    'KB-33-40P': 53,
    'KB-33-50R': 50,
  },
  'Kottayam': {
    'KB-22-30R': 42,
    'KB-22-40P': 46,
    'KB-22-50P': 47,
    'KB-33-30R': 44,
    'KB-33-40P': 49,
    'KB-33-50R': 46,
  },
  'Alappuzha': {
    'KB-22-30R': 42,
    'KB-22-40P': 46,
    'KB-22-50P': 47,
    'KB-33-30R': 44,
    'KB-33-40P': 49,
    'KB-33-50R': 46,
  },
  'Idukki': {
    'KB-22-30R': 43,
    'KB-22-40P': 48,
    'KB-22-50P': 49,
    'KB-33-30R': 46,
    'KB-33-40P': 51,
    'KB-33-50R': 47,
  },
  'Pathanamthitta': {
    'KB-22-30R': 43,
    'KB-22-40P': 47,
    'KB-22-50P': 48,
    'KB-33-30R': 45,
    'KB-33-40P': 50,
    'KB-33-50R': 47,
  },
  'Kollam': {
    'KB-22-30R': 43,
    'KB-22-40P': 47,
    'KB-22-50P': 48,
    'KB-33-30R': 45,
    'KB-33-40P': 50,
    'KB-33-50R': 47,
  },
  'Thiruvananthapuram': {
    'KB-22-30R': 44,
    'KB-22-40P': 48,
    'KB-22-50P': 49,
    'KB-33-30R': 46,
    'KB-33-40P': 51,
    'KB-33-50R': 48,
  }
};

export const getStoneRate = (stoneCode, districtId = 'Palakkad') => {
  const ratesForDistrict = DISTRICT_RATES[districtId] || DISTRICT_RATES['Palakkad'];
  return ratesForDistrict[stoneCode] || 38;
};

export const STONE_CATALOG = [
  {
    code: 'KB-22-30R',
    name: '2×2 Natural Rough Split',
    malayalamTitle: '(കുറച്ച്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 30mm rough',
    thickness: '30mm',
    finish: 'rough',
    finishBadge: 'Rough Non-Slip',
    badgeVariant: 'green',
    ratePerSqft: 38, // Palakkad default selling rate
    isBestValue: true,
    slabArea: 4,
    image: '/s2.jpeg',
    keralaUse: 'Car Porch & Open Courtyard (മഴയത്ത് തെന്നില്ല)',
    tag: 'Top Choice for Kerala Porch',
    weightPerSqftKg: 7.5,
    category: 'flooring'
  },
  {
    code: 'KB-22-40P',
    name: '2×2 Calibrated Honed Polish',
    malayalamTitle: '(നരിപ്പോളീഷ്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 40mm polish',
    thickness: '40mm',
    finish: 'polish',
    finishBadge: 'Honed Satin Polish',
    badgeVariant: 'amber',
    ratePerSqft: 42, // Palakkad default selling rate
    isBestValue: false,
    slabArea: 4,
    image: '/p1.jpeg',
    keralaUse: 'Sitout, Veranda & Covered Patios (മുറ്റങ്ങൾ)',
    tag: 'Classic Kerala Architecture',
    weightPerSqftKg: 10.0,
    category: 'flooring'
  },
  {
    code: 'KB-22-50P',
    name: '2×2 Mirror Polish Luxury',
    malayalamTitle: '(മിറർ പോളിഷ്)',
    size: '2x2',
    sizeDisplay: '2×2',
    spec: '2x2 · 50mm polish',
    thickness: '50mm',
    finish: 'polish',
    finishBadge: 'Diamond Mirror Polish',
    badgeVariant: 'gold',
    ratePerSqft: 40, // Palakkad default selling rate
    isBestValue: false,
    slabArea: 4,
    image: '/p2.jpeg',
    keralaUse: 'Interior Halls, Luxury Villas & Resorts (വില്ലാവാസങ്ങൾ)',
    tag: 'Heavy Calibrated 50mm',
    weightPerSqftKg: 12.5,
    category: 'finish'
  },
  {
    code: 'KB-33-30R',
    name: '3×3 Grand Format Rough',
    malayalamTitle: '(നാച്ചുറൽ)',
    size: '3x3',
    sizeDisplay: '3×3',
    spec: '3x3 · 30mm rough',
    thickness: '30mm',
    finish: 'rough',
    finishBadge: 'Natural Rough Split',
    badgeVariant: 'emerald',
    ratePerSqft: 40, // Palakkad default selling rate
    isBestValue: false,
    slabArea: 9,
    image: '/s1.jpeg',
    keralaUse: 'Traditional Courtyard & Big Lawns (പുറംമുറ്റങ്ങൾ, ലോൺ)',
    tag: 'Fewer Grout Joints',
    weightPerSqftKg: 7.5,
    category: 'cladding'
  },
  {
    code: 'KB-33-40P',
    name: '3×3 Premium Stepping Slab',
    malayalamTitle: '(നടപ്പാത)',
    size: '3x3',
    sizeDisplay: '3×3',
    spec: '3x3 · 40mm polish',
    thickness: '40mm',
    finish: 'polish',
    finishBadge: 'Honed Smooth Finish',
    badgeVariant: 'yellow',
    ratePerSqft: 45, // Palakkad default selling rate
    isBestValue: false,
    slabArea: 9,
    image: '/p3.jpeg',
    keralaUse: 'Garden Stepping Walkways & Terraces (തോട്ടപ്പാതകൾ)',
    tag: 'Contemporary Paving',
    weightPerSqftKg: 10.0,
    category: 'pathways'
  },
  {
    code: 'KB-33-50R',
    name: '3×3 Heavy 50mm Block Slab',
    malayalamTitle: '(വലിയ കട്ട് സ്റ്റോൺ)',
    size: '3x3',
    sizeDisplay: '3×3',
    spec: '3x3 · 50mm rough',
    thickness: '50mm',
    finish: 'rough',
    finishBadge: 'Quarry Rough Heavy Duty',
    badgeVariant: 'teal',
    ratePerSqft: 42, // Palakkad default selling rate
    isBestValue: false,
    slabArea: 9,
    image: '/s3.jpeg',
    keralaUse: 'Heavy Lorry Entrance, Gate Ramp & Padippura',
    tag: 'Truck Load Bearing 50mm',
    weightPerSqftKg: 12.5,
    category: 'custom'
  }
];
